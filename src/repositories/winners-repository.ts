import { BASE_URL } from '@/shared/constants';
import { type Winner } from '@/types/types';
import { isWinner, isWinners } from './validation';

const winnersUrl = `${BASE_URL}winners/`;

export async function getAllWinners(): Promise<Winner[]> {
  try {
    const response = await fetch(winnersUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data: unknown = await response.json();

    if (!isWinners(data)) {
      throw new Error('Failed to parse Winners data');
    }

    return data;
  } catch (error) {
    throw new Error('Failed to fetch Winners data');
  }
}

export async function getWinnerById(id: number): Promise<Winner> {
  try {
    const response = await fetch(`${winnersUrl}${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data: unknown = await response.json();

    if (!isWinner(data)) {
      throw new Error('Failed to parse data of the Winner');
    }
    return data;
  } catch (error) {
    throw new Error('Failed to parse data of the Winner');
  }
}

export async function createWinner(winnerData: Record<string, number>): Promise<Winner> {
  try {
    const response = await fetch(winnersUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(winnerData),
    });
    if (!response.ok) {
      throw new Error('Failed to create winner');
    }
    const data: unknown = await response.json();

    if (!isWinner(data)) {
      throw new Error('Failed to parse Winner`s data');
    }

    return data;
  } catch (error) {
    throw new Error('Failed to create new winner');
  }
}

export async function deleteWinner(id: number): Promise<void> {
  try {
    const response = await fetch(`${winnersUrl}${id}`, { method: 'DELETE' });

    if (!response.ok) {
      throw new Error('Failed to delete winner');
    }
  } catch (error) {
    throw new Error('Failed to delete winner');
  }
}

export async function updateCar(winnerData: Winner): Promise<Winner> {
  try {
    const response = await fetch(`${winnersUrl}${winnerData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(winnerData),
    });
    if (!response.ok) {
      throw new Error('Failed to update car');
    }
    const data: unknown = await response.json();

    if (!isWinner(data)) {
      throw new Error('Failed to parse Winner data');
    }

    return data;
  } catch (error) {
    throw new Error('Failed to update car');
  }
}
