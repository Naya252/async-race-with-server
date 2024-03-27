import { type Winner } from '@/types/types';
import { ITEMS_PER_PAGE, ENDPOINTS, ERROR_MESSAGES } from '@/shared/api-constants';
import { isWinner, isWinners } from './validation';
import api from './api/api';

export async function getWinnersByPage(
  page = '1',
  sort = 'id',
  order = 'ASC',
): Promise<Record<string, string | Winner[]>> {
  const data = await api.get({
    endpoint: `${ENDPOINTS.winners}`,
    options: { _limit: String(ITEMS_PER_PAGE.winners), _page: page, _sort: sort, _order: order },
  });

  if (typeof data === 'object' && 'resp' in data && 'total' in data && typeof data.total === 'string') {
    if (!isWinners(data.resp)) {
      throw new Error(ERROR_MESSAGES.Winners);
    }
  }

  return data;
}

export async function getWinnerById(id: number): Promise<Winner> {
  const data = await api.get({ endpoint: `${ENDPOINTS.winners}/${id}` });
  if (!isWinner(data)) {
    throw new Error(ERROR_MESSAGES.Winner);
  }
  return data;
}

export async function createWinner(carData: Record<string, number | string>): Promise<Winner> {
  const data = await api.post({ endpoint: ENDPOINTS.winners, data: carData });
  if (!isWinner(data)) {
    throw new Error(ERROR_MESSAGES.Winner);
  }
  return data;
}

export async function updateWinner(winnerData: Winner): Promise<Winner> {
  const data = await api.put({ endpoint: `${ENDPOINTS.winners}/${winnerData.id}`, data: winnerData });
  if (!isWinner(data)) {
    throw new Error(ERROR_MESSAGES.Winner);
  }
  return data;
}

export async function deleteWinner(id: number): Promise<void> {
  await api.delete({ endpoint: `${ENDPOINTS.winners}/${id}` });
}
