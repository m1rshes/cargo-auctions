import type {
  AuctionDetail,
  AuctionListItem,
  AuctionType,
  AuctionStatus,
  Bet,
  BodyType,
  TradingStatus,
} from '../../api/schema';
import { CITIES, findCity } from './cities';

const AUC_TYPES: AuctionType[] = ['Request', 'Up', 'Down', 'FixPrice'];
const STATUSES: AuctionStatus[] = ['active', 'active', 'active', 'paused', 'finished', 'draft'];
const BODY_TYPES: BodyType[] = ['tent', 'refrigerator', 'isotherm', 'platform', 'container'];
const CARGO_NAMES = ['Металлопрокат', 'Стройматериалы', 'Продукты питания', 'Бытовая техника', 'Текстиль', 'Автозапчасти', 'Химическая продукция'];
const CARRIERS = ['ООО "ТрансЛогистик"', 'ИП Смирнов А.В.', 'ООО "СибГрузАвто"', 'АвтоПеревозчик-24', 'ООО "ГрузСервис"', 'ИП Кузнецова Е.С.', 'ООО "ФрахтЛайн"'];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function pick<T>(arr: T[], rnd: () => number): T {
  return arr[Math.floor(rnd() * arr.length)];
}

function addDays(base: Date, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

interface MockAuction {
  detail: AuctionDetail;
  listItem: AuctionListItem;
  bets: Bet[];
}

const AUCTIONS_COUNT = 87;
const store = new Map<string, MockAuction>();

function generateAuction(index: number): MockAuction {
  const rnd = seededRandom(index * 7 + 13);
  const auctionUuid = `auc-${String(index).padStart(4, '0')}`;
  const aucType = pick(AUC_TYPES, rnd);
  const status = pick(STATUSES, rnd);
  const loadCity = findCity(1 + Math.floor(rnd() * CITIES.length));
  let unloadCity = findCity(1 + Math.floor(rnd() * CITIES.length));
  if (unloadCity.id === loadCity.id) unloadCity = findCity((loadCity.id % CITIES.length) + 1);

  const today = new Date('2026-07-29');
  const loadDate = addDays(today, Math.floor(rnd() * 20) - 5);
  const unloadDate = addDays(new Date(loadDate), 1 + Math.floor(rnd() * 5));

  const basePrice = 30000 + Math.floor(rnd() * 250000);
  const step = [500, 1000, 2000, 5000][Math.floor(rnd() * 4)];
  const weightKg = 1000 + Math.floor(rnd() * 19000);
  const volumeM3 = Math.round((10 + rnd() * 90) * 10) / 10;
  const bodyType = pick(BODY_TYPES, rnd);
  const cargoName = pick(CARGO_NAMES, rnd);

  const hideBetsHistory = rnd() < 0.12;
  const hideContacts = rnd() < 0.15;
  const noViewCargoPrice = rnd() < 0.08;
  const isAvailable = status === 'active' && rnd() > 0.1;
  const canSetBet = status === 'active' && isAvailable && rnd() > 0.1;

  // Сгенерировать ставки
  const betsCount = status === 'draft' ? 0 : Math.floor(rnd() * 9);
  const bets: Bet[] = [];
  let currentPrice = basePrice;
  for (let i = 0; i < betsCount; i++) {
    const priceWithVat = aucType === 'Down' ? basePrice - i * step * (1 + Math.floor(rnd() * 3)) : basePrice + i * step * (1 + Math.floor(rnd() * 3));
    const isCancelled = rnd() < 0.15;
    bets.push({
      id: `${auctionUuid}-bet-${i}`,
      carrierName: pick(CARRIERS, rnd),
      priceWithVat: Math.max(priceWithVat, step),
      priceWithoutVat: Math.round(Math.max(priceWithVat, step) / 1.2),
      rank: i + 1,
      isWinner: false,
      isCancelled,
      cancelReason: isCancelled ? pick(['outbid', 'organizer_rejected', 'carrier_withdrew'] as const, rnd) : null,
      createdAt: new Date(today.getTime() - i * 3600_000).toISOString(),
      isMine: false,
    });
  }
  // Пересчитать ранги/победителя по активным ставкам, отсортированным по выгодности
  const active = bets.filter((b) => !b.isCancelled).sort((a, b) => (aucType === 'Down' ? a.priceWithVat - b.priceWithVat : b.priceWithVat - a.priceWithVat));
  active.forEach((b, i) => {
    b.rank = i + 1;
    b.isWinner = i === 0 && status === 'finished';
  });
  if (active.length > 0) {
    currentPrice = active[0].priceWithVat;
  }

  let tradingStatus: TradingStatus | null = null;
  if (status === 'finished' && active[0]) tradingStatus = 'Winner';

  const cargoNum = `CN-${2026}${String(index).padStart(5, '0')}`;

  const detail: AuctionDetail = {
    auctionUuid,
    cargoNum,
    aucType,
    status,
    organizer: {
      id: `org-${index % 20}`,
      name: `ООО "Грузоотправитель №${(index % 20) + 1}"`,
      rating: Math.round((3 + rnd() * 2) * 10) / 10,
      verified: rnd() > 0.3,
    },
    contacts: hideContacts
      ? null
      : {
          name: 'Иванов Иван Иванович',
          phone: '+7 (900) 123-45-67',
          email: 'logist@example.com',
        },
    route: [
      { id: `${auctionUuid}-p1`, city: loadCity, address: 'ул. Промышленная, д. 5', date: loadDate, order: 1, kind: 'load' },
      { id: `${auctionUuid}-p2`, city: unloadCity, address: 'ул. Складская, д. 12', date: unloadDate, order: 2, kind: 'unload' },
    ],
    cargo: { name: cargoName, weightKg, volumeM3, bodyType },
    requirements: {
      bodyTypes: [bodyType],
      temperatureMin: bodyType === 'refrigerator' ? -18 : null,
      temperatureMax: bodyType === 'refrigerator' ? 4 : null,
      adr: rnd() < 0.05,
    },
    payment: {
      vatIncluded: rnd() > 0.4,
      delayDays: [0, 7, 14, 30][Math.floor(rnd() * 4)],
      prepaymentPercent: rnd() > 0.7 ? 30 : null,
      comment: null,
    },
    trading: {
      currentPrice: noViewCargoPrice ? 0 : currentPrice,
      pricePerKm: noViewCargoPrice ? null : Math.round((currentPrice / (300 + rnd() * 2000)) * 100) / 100,
      step,
      min: aucType === 'Down' ? Math.round(basePrice * 0.5) : null,
      max: aucType === 'Up' ? Math.round(basePrice * 1.8) : null,
      currency: 'RUB',
      canSetBet,
      hasMyBet: false,
      myBetPrice: null,
      tradingStatus,
    },
    restrictions: {
      can_set_bet: canSetBet,
      hide_bets_history: hideBetsHistory,
      hide_points_address_and_contacts: hideContacts,
      no_view_cargo_price: noViewCargoPrice,
    },
    createdAt: new Date(today.getTime() - index * 3600_000).toISOString(),
  };

  const listItem: AuctionListItem = {
    auctionUuid,
    cargoNum,
    aucType,
    status,
    tradingStatus: detail.trading.tradingStatus,
    loadCity,
    unloadCity,
    loadDate,
    unloadDate,
    cargo: { name: cargoName, weightKg, volumeM3, bodyType },
    currentPrice: detail.trading.currentPrice,
    pricePerKm: detail.trading.pricePerKm,
    step,
    hasMyBet: false,
    isAvailable,
    restrictions: { can_set_bet: canSetBet, no_view_cargo_price: noViewCargoPrice },
  };

  return { detail, listItem, bets };
}

function ensureSeeded() {
  if (store.size > 0) return;
  for (let i = 1; i <= AUCTIONS_COUNT; i++) {
    const a = generateAuction(i);
    store.set(a.detail.auctionUuid, a);
  }
}

export function getAllAuctions(): MockAuction[] {
  ensureSeeded();
  return Array.from(store.values());
}

export function getAuction(uuid: string): MockAuction | undefined {
  ensureSeeded();
  return store.get(uuid);
}

/** Применяет новую ставку пользователя и пересчитывает состояние аукциона (мутирует store). */
export function placeBet(uuid: string, price: number): { bet: Bet; auction: MockAuction } | null {
  const auction = getAuction(uuid);
  if (!auction) return null;

  // Отменяем предыдущую ставку "моя", если была
  const existingMineIdx = auction.bets.findIndex((b) => b.isMine && !b.isCancelled);
  if (existingMineIdx !== -1) {
    auction.bets[existingMineIdx].isCancelled = true;
    auction.bets[existingMineIdx].cancelReason = 'carrier_withdrew';
  }

  const newBet: Bet = {
    id: `${uuid}-bet-mine-${Date.now()}`,
    carrierName: 'Моя компания (ООО "Ваша Логистика")',
    priceWithVat: price,
    priceWithoutVat: Math.round(price / 1.2),
    rank: 0,
    isWinner: false,
    isCancelled: false,
    cancelReason: null,
    createdAt: new Date().toISOString(),
    isMine: true,
  };
  auction.bets.unshift(newBet);

  // Пересчёт рангов по активным ставкам
  const active = auction.bets
    .filter((b) => !b.isCancelled)
    .sort((a, b) => (auction.detail.aucType === 'Down' ? a.priceWithVat - b.priceWithVat : b.priceWithVat - a.priceWithVat));
  active.forEach((b, i) => {
    b.rank = i + 1;
  });

  const myRank = newBet.rank;
  auction.detail.trading.currentPrice = active[0]?.priceWithVat ?? price;
  auction.detail.trading.hasMyBet = true;
  auction.detail.trading.myBetPrice = price;
  auction.detail.trading.tradingStatus = myRank === 1 ? 'Leading' : 'Losing';

  auction.listItem.currentPrice = auction.detail.trading.currentPrice;
  auction.listItem.hasMyBet = true;
  auction.listItem.tradingStatus = auction.detail.trading.tradingStatus;

  return { bet: newBet, auction };
}

export function resetStore() {
  store.clear();
}
