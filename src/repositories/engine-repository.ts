import type { EngineParams, CarRaceData, DriveMode } from '@/types/types';
import { ENDPOINTS, ERROR_MESSAGES } from '@/shared/api-constants';
import { isCarRaceData, isDriveMode } from './validation';
import api from './api/api';

export async function changeEngineCar(engineParams: EngineParams, controller?: AbortController): Promise<CarRaceData> {
  let signal;
  if (typeof controller !== 'undefined') {
    signal = controller.signal;
  }

  const data = await api.patch({
    endpoint: `${ENDPOINTS.engine}`,
    options: { id: String(engineParams.id), status: engineParams.status },
    signal,
  });
  if (!isCarRaceData(data)) {
    throw new Error(ERROR_MESSAGES.Engine);
  }
  return data;
}

export async function switchDriveMode(id: number, controller?: AbortController): Promise<DriveMode> {
  let signal;
  if (typeof controller !== 'undefined') {
    signal = controller.signal;
  }

  const data = await api.patch({
    endpoint: `${ENDPOINTS.engine}`,
    options: { id: String(id), status: 'drive' },
    signal,
  });
  if (!isDriveMode(data)) {
    throw new Error(ERROR_MESSAGES.Drive);
  }
  return data;
}
