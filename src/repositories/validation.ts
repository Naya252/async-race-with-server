import type { Car, CarRaceData, DriveMode, Winner } from '@/types/types';

export const isCar = (value: unknown): value is Car => {
  if (
    value !== null &&
    typeof value === 'object' &&
    'id' in value &&
    typeof value.id === 'number' &&
    'name' in value &&
    typeof value.name === 'string' &&
    'color' in value &&
    typeof value.color === 'string'
  ) {
    return true;
  }

  return false;
};

export const isCars = (value: unknown): value is Car[] => {
  if (value !== null && typeof value === 'object' && Array.isArray(value) && value.every((round) => isCar(round))) {
    return true;
  }

  return false;
};

export const isCarRaceData = (value: unknown): value is CarRaceData => {
  if (
    value !== null &&
    typeof value === 'object' &&
    'velocity' in value &&
    typeof value.velocity === 'number' &&
    'distance' in value &&
    typeof value.distance === 'number'
  ) {
    return true;
  }

  return false;
};

export const isDriveMode = (value: unknown): value is DriveMode => {
  if (value !== null && typeof value === 'object' && 'success' in value && typeof value.success === 'boolean') {
    return true;
  }

  return false;
};

export const isWinner = (value: unknown): value is Winner => {
  if (
    value !== null &&
    typeof value === 'object' &&
    'id' in value &&
    typeof value.id === 'number' &&
    'wins' in value &&
    typeof value.wins === 'number' &&
    'time' in value &&
    typeof value.time === 'number'
  ) {
    return true;
  }

  return false;
};

export const isWinners = (value: unknown): value is Winner[] => {
  if (value !== null && typeof value === 'object' && Array.isArray(value) && value.every((round) => isWinner(round))) {
    return true;
  }

  return false;
};
