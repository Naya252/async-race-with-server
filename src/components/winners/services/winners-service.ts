import * as winnersRepository from '@/repositories/winners-repository';
import store from '@/store/store';
import type { Car as CarType, Winner } from '@/types/types';
import alerts from '@/components/alert/alert';

export async function getWinnersData(page = '1', sort = 'id'): Promise<Winner[]> {
  const winners = await winnersRepository.getWinnersByPage(page, sort);
  let data: Winner[] = [];

  if (typeof winners.resp !== 'string' && typeof winners.resp !== 'undefined' && typeof winners.total === 'string') {
    store.winners.setWinners(winners.resp);
    store.winners.setAllCount(winners.total);
    const winnersData = store.winners.getWinners();

    data = winnersData;
  }

  return data;
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
