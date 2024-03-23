import { type Winner } from '@/types/types';
import { isWinner, isWinners } from './validation';
import api from './api/api';

const WINNERS_ENDPOINT = `winners`;
const ERROR_MESSAGES = {
  Winners: 'Failed to parse Winners data',
  Winner: 'Failed to parse Winner`s data',
};

export async function getAllWinners(): Promise<Winner[]> {
  const data = await api.get({ endpoint: `${WINNERS_ENDPOINT}/` });
  if (!isWinners(data)) {
    throw new Error(ERROR_MESSAGES.Winners);
  }
  return data;
}

export async function getWinnerById(id: number): Promise<Winner> {
  const data = await api.get({ endpoint: `${WINNERS_ENDPOINT}/${id}` });
  if (!isWinner(data)) {
    throw new Error(ERROR_MESSAGES.Winner);
  }
  return data;
}

export async function createWinner(carData: Record<string, number | string>): Promise<Winner> {
  const data = await api.post({ endpoint: WINNERS_ENDPOINT, data: carData });
  if (!isWinner(data)) {
    throw new Error(ERROR_MESSAGES.Winner);
  }
  return data;
}

export async function updateWinner(winnerData: Winner): Promise<Winner> {
  const data = await api.put({ endpoint: `${WINNERS_ENDPOINT}/${winnerData.id}`, data: winnerData });
  if (!isWinner(data)) {
    throw new Error(ERROR_MESSAGES.Winner);
  }
  return data;
}

export async function deleteWinner(id: number): Promise<void> {
  await api.delete({ endpoint: `${WINNERS_ENDPOINT}/${id}` });
}
