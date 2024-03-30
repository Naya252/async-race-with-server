import type { Car, Winner, DriveMode, CarRaceData } from '@/types/types';

export type Statuses = {
  Ok: 200;
  Created: 201;
  BadRequest: 400;
  NotFound: 404;
  TooManyRequests: 429;
  ServerError: 500;
};

export type SuccessDel = Record<never, never>;

type ErrorCodes = Statuses['BadRequest'] | Statuses['NotFound'] | Statuses['TooManyRequests'] | Statuses['ServerError'];
type SuccessCode = Statuses['Ok'] | Statuses['Created'];

export type ApiResponseSuccess = { statusText: 'OK'; status: SuccessCode };
export type ApiResponseError = { statusText: 'error'; status: ErrorCodes; message: string };

export type SuccessData = Car[] | Car | Winner[] | Winner | DriveMode | CarRaceData | SuccessDel;
