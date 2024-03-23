import type { EngineParams, CarRaceData, DriveMode } from '@/types/types';
import { isCarRaceData, isDriveMode } from './validation';
import api from './api/api';

const ENGINE_ENDPOINT = `engine`;
const ERROR_MESSAGES = {
  Engine: 'Failed to change engine car',
  Drive: 'Failed to parse drive mode for car',
};

export async function changeEngineCar(engineParams: EngineParams): Promise<CarRaceData> {
  const data = await api.patch({
    endpoint: `${ENGINE_ENDPOINT}`,
    options: { id: String(engineParams.id), status: engineParams.status },
  });
  if (!isCarRaceData(data)) {
    throw new Error(ERROR_MESSAGES.Engine);
  }
  return data;
}

export async function switchDriveMode(id: number): Promise<DriveMode> {
  const data = await api.patch({
    endpoint: `${ENGINE_ENDPOINT}`,
    options: { id: String(id), status: 'drive' },
  });
  if (!isDriveMode(data)) {
    throw new Error(ERROR_MESSAGES.Drive);
  }
  return data;
}
