import { BASE_URL } from '@/shared/constants';
import { type Car } from '@/types/types';
import { isCars, isCar } from './validation';

const garageUrl = `${BASE_URL}garage/`;

export async function getAllCars(): Promise<Car[]> {
  try {
    const response = await fetch(garageUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data: unknown = await response.json();

    if (!isCars(data)) {
      throw new Error('Failed to parse Cars data');
    }

    return data;
  } catch (error) {
    throw new Error('Failed to fetch Cars data');
  }
}

export async function getCarById(id: number): Promise<Car> {
  try {
    const response = await fetch(`${garageUrl}${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data: unknown = await response.json();

    if (!isCar(data)) {
      throw new Error('Failed to parse Car data');
    }
    return data;
  } catch (error) {
    throw new Error('Failed to fetch Car data');
  }
}

export async function createCar(carData: Record<string, number | string>): Promise<Car> {
  try {
    const response = await fetch(garageUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carData),
    });
    if (!response.ok) {
      throw new Error('Failed to create car');
    }
    const data: unknown = await response.json();

    if (!isCar(data)) {
      throw new Error('Failed to parse Car data');
    }

    return data;
  } catch (error) {
    throw new Error('Failed to create new car');
  }
}

export async function deleteCar(id: number): Promise<void> {
  try {
    const response = await fetch(`${garageUrl}${id}`, { method: 'DELETE' });

    if (!response.ok) {
      throw new Error('Failed to delete car');
    }
  } catch (error) {
    throw new Error('Failed to delete car');
  }
}

export async function updateCar(carData: Car): Promise<Car> {
  try {
    const response = await fetch(`${garageUrl}${carData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carData),
    });
    if (!response.ok) {
      throw new Error('Failed to update car');
    }
    const data: unknown = await response.json();

    if (!isCar(data)) {
      throw new Error('Failed to parse Car data');
    }

    return data;
  } catch (error) {
    throw new Error('Failed to update new car');
  }
}
