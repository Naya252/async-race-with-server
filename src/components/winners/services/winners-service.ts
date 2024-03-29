import * as winnersRepository from '@/repositories/winners-repository';
import store from '@/store/store';
import type { Car as CarType, Winner } from '@/types/types';
import alerts from '@/components/alert/alert';
import { ORDER, SORT } from '@/shared/api-constants';

export async function getWinnersData(): Promise<Winner[]> {
  const page = String(store.winners.getCurrentPage());
  const sort = store.winners.getSort();
  const order = store.winners.getOrder();
  const winners = await winnersRepository.getWinnersByPage(page, sort, order);
  let data: Winner[] = [];

  if (typeof winners.resp !== 'string' && typeof winners.resp !== 'undefined' && typeof winners.total === 'string') {
    store.winners.setWinners(winners.resp);
    store.winners.setAllCount(winners.total);
    const winnersData = store.winners.getWinners();

    data = winnersData;
  }

  return data;
}

export async function changeSort(e: Event): Promise<Winner[]> {
  let value;
  if (e.target !== null && e.target instanceof HTMLElement) {
    if (e.target.id === SORT.time) {
      value = await sortTable(SORT.time);
    }
    if (e.target.id === SORT.wins) {
      value = await sortTable(SORT.wins);
    }
  }
  if (typeof value === 'undefined') {
    throw new Error('winnrs undefined');
  }
  return value;
}

async function sortTable(sortBy: string): Promise<Winner[]> {
  const sort = store.winners.getSort();
  const order = store.winners.getOrder();

  if (sort === sortBy) {
    if (order === ORDER.more) {
      store.winners.setOrder(ORDER.less);
    } else {
      store.winners.setOrder(ORDER.more);
    }
  } else {
    store.winners.setSort(sortBy);
    store.winners.setOrder(ORDER.more);
  }

  const value = await getWinnersData();
  return value;
}

export async function getWinnerById(id: number): Promise<Winner> {
  const winner = await winnersRepository.getWinnerById(id);
  return winner;
}

export async function saveWinner(carData: CarType, time: number): Promise<void> {
  try {
    const existWinner = await winnersRepository.getWinnerById(carData.id);
    let updatedData = { ...existWinner, wins: existWinner.wins + 1 };
    if (existWinner.time > time) {
      updatedData = { ...updatedData, time };
    }
    await winnersRepository.updateWinner(updatedData);
    alerts.addAlert('info', `Updated data in Winner's list for ${carData.name}`);
  } catch (error) {
    await winnersRepository.createWinner({ id: carData.id, wins: 1, time });
    alerts.addAlert('info', `${carData.name} added to Winner's list`);
  }
}
