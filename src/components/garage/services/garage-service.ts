import { FIRST_PART_NAME, SECOND_PART_NAME } from '@/shared/car-constants';
import * as garageRepository from '@/repositories/garage-repository';
import * as engineRepository from '@/repositories/engine-repository';
import store from '@/store/store';
import { type Car, type CarRaceData, type DriveMode, STATUS } from '@/types/types';
import alerts from '@/components/alert/alert';

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

export async function startEngine(carId: number, controller?: AbortController): Promise<CarRaceData> {
  if (typeof STATUS.start === 'undefined') {
    throw new Error('STATUS.start === undefined');
  }
  const data = await engineRepository.changeEngineCar({ id: carId, status: STATUS.start }, controller);
  return data;
}

export async function stopEngine(carId: number, controller?: AbortController): Promise<CarRaceData> {
  if (typeof STATUS.stop === 'undefined') {
    throw new Error('STATUS.stop === undefined');
  }
  const data = await engineRepository.changeEngineCar({ id: carId, status: STATUS.stop }, controller);
  return data;
}

export async function changeDriveMode(carId: number, controller?: AbortController): Promise<DriveMode> {
  const driveMode = await engineRepository.switchDriveMode(carId, controller);
  return driveMode;
}

export const showWinnerAlert = (carData: Car, time: number): void => {
  alerts.addAlert('success', `${carData.name} is winner! <br> time: ${time} s`);
};

export async function getCarById(id: number): Promise<Car> {
  const car = await garageRepository.getCarById(id);
  return car;
}
