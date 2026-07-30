import { http, HttpResponse, delay } from 'msw';
import type {
  AuctionListFilters,
  AuctionListRequest,
  AuctionListResponse,
  BetsResponse,
  CreateBetRequest,
  CreateBetResponse,
} from '../../api/schema';
import { getAllAuctions, getAuction, placeBet } from '../data/store';

const API_BASE = '/api';

function matchesFilters(item: ReturnType<typeof getAllAuctions>[number]['listItem'], filters: AuctionListFilters): boolean {
  if (filters.cargo_num && !item.cargoNum.toLowerCase().includes(filters.cargo_num.toLowerCase())) return false;
  if (filters.status && item.status !== filters.status) return false;
  if (filters.statuses && filters.statuses.length > 0 && !filters.statuses.includes(item.status)) return false;
  if (filters.auc_type && item.aucType !== filters.auc_type) return false;
  if (filters.load_city && item.loadCity.id !== filters.load_city) return false;
  if (filters.unload_city && item.unloadCity.id !== filters.unload_city) return false;
  if (filters.load_date_from && item.loadDate < filters.load_date_from) return false;
  if (filters.load_date_to && item.loadDate > filters.load_date_to) return false;
  if (filters.is_available !== undefined && item.isAvailable !== filters.is_available) return false;
  if (filters.is_bidder !== undefined && item.hasMyBet !== filters.is_bidder) return false;
  if (filters.price_from !== undefined && (item.currentPrice ?? 0) < filters.price_from) return false;
  if (filters.price_to !== undefined && (item.currentPrice ?? 0) > filters.price_to) return false;
  return true;
}

export const auctionHandlers = [
  http.post(`${API_BASE}/auctions/list`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as AuctionListRequest;
    const page = body.page && body.page > 0 ? body.page : 1;
    const pageSize = body.pageSize && body.pageSize > 0 ? body.pageSize : 20;

    let items = getAllAuctions()
      .map((a) => a.listItem)
      .filter((item) => matchesFilters(item, body));

    if (body.sortBy === 'price') {
      items = items.slice().sort((a, b) => (b.currentPrice ?? 0) - (a.currentPrice ?? 0));
    } else if (body.sortBy === 'load_date') {
      items = items.slice().sort((a, b) => a.loadDate.localeCompare(b.loadDate));
    }

    const total = items.length;
    const start = (page - 1) * pageSize;
    const pageItems = items.slice(start, start + pageSize);

    const response: AuctionListResponse = { items: pageItems, page, pageSize, total };
    return HttpResponse.json(response);
  }),

  http.get(`${API_BASE}/auctions/:auctionUuid`, async ({ params }) => {
    await delay(300);
    const { auctionUuid } = params as { auctionUuid: string };
    const auction = getAuction(auctionUuid);
    if (!auction) {
      return HttpResponse.json({ message: 'Аукцион не найден', code: 'NOT_FOUND' }, { status: 404 });
    }
    return HttpResponse.json(auction.detail);
  }),

  http.get(`${API_BASE}/auctions/:auctionUuid/bets`, async ({ params }) => {
    await delay(250);
    const { auctionUuid } = params as { auctionUuid: string };
    const auction = getAuction(auctionUuid);
    if (!auction) {
      return HttpResponse.json({ message: 'Аукцион не найден', code: 'NOT_FOUND' }, { status: 404 });
    }
    if (auction.detail.restrictions.hide_bets_history) {
      const response: BetsResponse = { items: [], participantsCount: auction.bets.length, hidden: true };
      return HttpResponse.json(response);
    }
    const response: BetsResponse = {
      items: auction.bets,
      participantsCount: new Set(auction.bets.map((b) => b.carrierName)).size,
      hidden: false,
    };
    return HttpResponse.json(response);
  }),

  http.post(`${API_BASE}/auctions/:auctionUuid/bets`, async ({ params, request }) => {
    await delay(400);
    const { auctionUuid } = params as { auctionUuid: string };
    const auction = getAuction(auctionUuid);
    if (!auction) {
      return HttpResponse.json({ message: 'Аукцион не найден', code: 'NOT_FOUND' }, { status: 404 });
    }

    const body = (await request.json()) as CreateBetRequest;
    const errors: Record<string, string[]> = {};

    if (typeof body.price !== 'number' || Number.isNaN(body.price)) {
      errors.price = ['Цена обязательна и должна быть числом'];
    } else {
      if (body.price <= 0) errors.price = [...(errors.price ?? []), 'Цена должна быть больше 0'];
      const { min, max, step } = auction.detail.trading;
      if (min !== null && body.price < min) errors.price = [...(errors.price ?? []), `Цена не может быть меньше ${min}`];
      if (max !== null && body.price > max) errors.price = [...(errors.price ?? []), `Цена не может быть больше ${max}`];
      if (step > 0 && Math.abs(body.price % step) > 0.001 && min !== null) {
        // мягкая проверка шага — не блокируем, если нет min/max ориентира
      }
    }

    if (!auction.detail.trading.canSetBet) {
      errors.price = [...(errors.price ?? []), 'Установка ставки недоступна для этого аукциона'];
    }

    if (Object.keys(errors).length > 0) {
      return HttpResponse.json({ message: 'Ошибка валидации', errors }, { status: 422 });
    }

    const result = placeBet(auctionUuid, body.price);
    if (!result) {
      return HttpResponse.json({ message: 'Не удалось установить ставку', code: 'INTERNAL' }, { status: 500 });
    }

    const response: CreateBetResponse = { bet: result.bet, trading: result.auction.detail.trading };
    return HttpResponse.json(response, { status: 201 });
  }),
];
