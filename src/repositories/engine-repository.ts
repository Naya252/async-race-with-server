import { BASE_URL } from '@/shared/constants';
import type { EngineParams, CarRaceData, DriveMode } from '@/types/types';
import { isCarRaceData, isDriveMode } from './validation';

const engineUrl = `${BASE_URL}engine`;

export async function changeEngineCar(engineParams: EngineParams): Promise<CarRaceData> {
  try {
    const response = await fetch(`${engineUrl}?id=${engineParams.id}&status=${engineParams.status}`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error('Failed to change engine car');
    }
    const data: unknown = await response.json();
    if (!isCarRaceData(data)) {
      throw new Error('Failed to parse race data for car');
    }
    return data;
  } catch (error) {
    throw new Error('Failed to change engine car');
  }
}

export async function switchDriveMode(id: number): Promise<DriveMode> {
  try {
    const response = await fetch(`${engineUrl}?id=${id}&status=drive`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      throw new Error('Failed to change drive mode');
    }
    const data: unknown = await response.json();

    if (!isDriveMode(data)) {
      throw new Error('Failed to parse drive mode for car');
    }

    return data;
  } catch (error) {
    throw new Error('Failed to change drive mode');
  }
}
