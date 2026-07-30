import { setupWorker } from 'msw/browser';
import { auctionHandlers } from './handlers/auctions';

export const worker = setupWorker(...auctionHandlers);
