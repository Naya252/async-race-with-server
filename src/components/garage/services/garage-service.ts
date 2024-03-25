import { FIRST_PART_NAME, SECOND_PART_NAME } from '@/shared/constants';
import * as garageRepository from '@/repositories/garage-repository';
import store from '@/store/store';
import type { Car } from '@/types/types';

export function getRadomHex(): string {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  const hexR = r.toString(16).padStart(2, '0');
  const hexG = g.toString(16).padStart(2, '0');
  const hexB = b.toString(16).padStart(2, '0');

  return `#${hexR}${hexG}${hexB}`;
}

export function getRandomName(): string {
  const firstIndex = Math.floor(Math.random() * FIRST_PART_NAME.length);
  const secondIndex = Math.floor(Math.random() * SECOND_PART_NAME.length);

  return `${FIRST_PART_NAME[firstIndex]} ${SECOND_PART_NAME[secondIndex]}`;
}

export async function getCarsData(page = '1'): Promise<Car[]> {
  const cars = await garageRepository.getCarsByPage(page);
  let data: Car[] = [];

  if (typeof cars.resp !== 'string' && typeof cars.resp !== 'undefined' && typeof cars.total === 'string') {
    store.garage.setCars(cars.resp);
    store.garage.setAllCount(cars.total);
    const carsData = store.garage.getCars();

    data = carsData;
  }

  return data;
}
