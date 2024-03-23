import { type Car } from '@/types/types';
import { isCars, isCar } from './validation';
import api from './api/api';

const GARAGE_ENDPOINT = `garage`;
const ERROR_MESSAGES = {
  Cars: 'Failed to parse Cars data',
  Car: 'Failed to parse Car`s data',
};

export async function getAllCars(): Promise<Car[]> {
  const data = await api.get({ endpoint: `${GARAGE_ENDPOINT}/` });
  if (!isCars(data)) {
    throw new Error(ERROR_MESSAGES.Cars);
  }
  return data;
}

export async function getCarById(id: number): Promise<Car> {
  const data = await api.get({ endpoint: `${GARAGE_ENDPOINT}/${id}` });
  if (!isCar(data)) {
    throw new Error(ERROR_MESSAGES.Car);
  }
  return data;
}

export async function createCar(carData: Record<string, number | string>): Promise<Car> {
  const data = await api.post({ endpoint: GARAGE_ENDPOINT, data: carData });
  if (!isCar(data)) {
    throw new Error(ERROR_MESSAGES.Car);
  }
  return data;
}

export async function updateCar(carData: Car): Promise<Car> {
  const data = await api.put({ endpoint: `${GARAGE_ENDPOINT}/${carData.id}`, data: carData });
  if (!isCar(data)) {
    throw new Error(ERROR_MESSAGES.Car);
  }
  return data;
}

export async function deleteCar(id: number): Promise<void> {
  await api.delete({ endpoint: `${GARAGE_ENDPOINT}/${id}` });
}
