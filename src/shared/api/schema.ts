/**
 * Типы, отражающие контракт OpenAPI-схемы для API грузовых аукционов.
 * Источник контракта: /auctions/list, /auctions/{auctionUuid},
 * /auctions/{auctionUuid}/bets (GET/POST).
 */

export type AuctionType = 'Request' | 'Up' | 'Down' | 'FixPrice';

export type AuctionStatus =
  | 'draft'
  | 'active'
  | 'paused'
  | 'finished'
  | 'cancelled';

export type TradingStatus = 'Leading' | 'Losing' | 'Winner' | 'NoBet' | 'Outbid';

export type BodyType =
  | 'tent'
  | 'refrigerator'
  | 'isotherm'
  | 'platform'
  | 'container'
  | 'other';

export interface City {
  id: number;
  name: string;
  region: string | null;
}

export interface RoutePoint {
  id: string;
  city: City;
  address: string | null;
  date: string; // ISO date
  order: number;
  kind: 'load' | 'unload';
}

export interface Cargo {
  name: string;
  weightKg: number;
  volumeM3: number | null;
  bodyType: BodyType;
}

export interface CargoRequirements {
  bodyTypes: BodyType[];
  temperatureMin: number | null;
  temperatureMax: number | null;
  adr: boolean;
}

export interface PaymentTerms {
  vatIncluded: boolean;
  delayDays: number | null;
  prepaymentPercent: number | null;
  comment: string | null;
}

export interface Organizer {
  id: string;
  name: string;
  rating: number | null;
  verified: boolean;
}

export interface Contacts {
  name: string | null;
  phone: string | null;
  email: string | null;
}

export interface TradingParams {
  currentPrice: number;
  pricePerKm: number | null;
  step: number;
  min: number | null;
  max: number | null;
  currency: 'RUB';
  canSetBet: boolean;
  hasMyBet: boolean;
  myBetPrice: number | null;
  tradingStatus: TradingStatus | null;
}

export interface AuctionRestrictions {
  can_set_bet: boolean;
  hide_bets_history: boolean;
  hide_points_address_and_contacts: boolean;
  no_view_cargo_price: boolean;
}

/** Элемент списка аукционов — GET /auctions/list (сокращённый DTO) */
export interface AuctionListItem {
  auctionUuid: string;
  cargoNum: string;
  aucType: AuctionType;
  status: AuctionStatus;
  tradingStatus: TradingStatus | null;
  loadCity: City;
  unloadCity: City;
  loadDate: string;
  unloadDate: string | null;
  cargo: Pick<Cargo, 'name' | 'weightKg' | 'volumeM3' | 'bodyType'>;
  currentPrice: number | null;
  pricePerKm: number | null;
  step: number;
  hasMyBet: boolean;
  isAvailable: boolean;
  restrictions: Pick<AuctionRestrictions, 'can_set_bet' | 'no_view_cargo_price'>;
}

/** Полная карточка — GET /auctions/{auctionUuid} */
export interface AuctionDetail {
  auctionUuid: string;
  cargoNum: string;
  aucType: AuctionType;
  status: AuctionStatus;
  organizer: Organizer;
  contacts: Contacts | null; // null, если скрыты hide_points_address_and_contacts
  route: RoutePoint[];
  cargo: Cargo;
  requirements: CargoRequirements;
  payment: PaymentTerms;
  trading: TradingParams;
  restrictions: AuctionRestrictions;
  createdAt: string;
}

export type BetCancelReason =
  | 'outbid'
  | 'organizer_rejected'
  | 'carrier_withdrew'
  | 'auction_cancelled'
  | null;

/** Ставка — GET /auctions/{auctionUuid}/bets */
export interface Bet {
  id: string;
  carrierName: string;
  priceWithVat: number;
  priceWithoutVat: number;
  rank: number;
  isWinner: boolean;
  isCancelled: boolean;
  cancelReason: BetCancelReason;
  createdAt: string;
  isMine: boolean;
}

export interface BetsResponse {
  items: Bet[];
  participantsCount: number;
  hidden: boolean; // hide_bets_history
}

/** POST /auctions/{auctionUuid}/bets — тело запроса */
export interface CreateBetRequest {
  price: number;
}

export interface CreateBetResponse {
  bet: Bet;
  trading: TradingParams;
}

/** Стандартная 422-ошибка валидации */
export interface ValidationErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}

export interface ApiErrorResponse {
  message: string;
  code: string;
}

// ---- /auctions/list request/response ----

export type AuctionListSortBy = 'load_date' | 'price' | 'created_at';

export interface AuctionListFilters {
  cargo_num?: string;
  status?: AuctionStatus;
  statuses?: AuctionStatus[];
  auc_type?: AuctionType;
  load_city?: number; // city id
  unload_city?: number; // city id
  load_date_from?: string;
  load_date_to?: string;
  is_available?: boolean;
  is_bidder?: boolean;
  price_from?: number;
  price_to?: number;
}

export interface AuctionListRequest extends AuctionListFilters {
  page: number;
  pageSize: number;
  sortBy?: AuctionListSortBy;
}

export interface AuctionListResponse {
  items: AuctionListItem[];
  page: number;
  pageSize: number;
  total: number;
}
