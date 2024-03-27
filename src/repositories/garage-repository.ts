import { type Car } from '@/types/types';
import { ITEMS_PER_PAGE, ENDPOINTS, ERROR_MESSAGES } from '@/shared/api-constants';
import { isCars, isCar } from './validation';
import api from './api/api';

export async function getAllCars(): Promise<Car[]> {
  const data = await api.get({ endpoint: `${ENDPOINTS.garage}/` });
  if (!isCars(data)) {
    throw new Error(ERROR_MESSAGES.Cars);
  }
  return data;
}

export async function getCarsByPage(page = '1'): Promise<Record<string, string | Car[]>> {
  const data = await api.get({
    endpoint: `${ENDPOINTS.garage}`,
    options: { _limit: String(ITEMS_PER_PAGE.garage), _page: page },
  });

  if (typeof data === 'object' && 'resp' in data && 'total' in data && typeof data.total === 'string') {
    if (!isCars(data.resp)) {
      throw new Error(ERROR_MESSAGES.Cars);
    }
  }

  return data;
}

export async function getCarById(id: number): Promise<Car> {
  const data = await api.get({ endpoint: `${ENDPOINTS.garage}/${id}` });
  if (!isCar(data)) {
    throw new Error(ERROR_MESSAGES.Car);
  }
  return data;
}

export async function createCar(carData: Record<string, number | string>): Promise<Car> {
  const data = await api.post({ endpoint: ENDPOINTS.garage, data: carData });
  if (!isCar(data)) {
    throw new Error(ERROR_MESSAGES.Car);
  }
  return data;
}

export async function updateCar(carData: Car): Promise<Car> {
  const data = await api.put({ endpoint: `${ENDPOINTS.garage}/${carData.id}`, data: carData });
  if (!isCar(data)) {
    throw new Error(ERROR_MESSAGES.Car);
  }
  return data;
}

export async function deleteCar(id: number): Promise<void> {
  await api.delete({ endpoint: `${ENDPOINTS.garage}/${id}` });
}
