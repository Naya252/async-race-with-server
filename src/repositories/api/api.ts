import { isCars, isCar, isWinner, isWinners, isCarRaceData, isDriveMode } from '@/repositories/validation';
import { BASE_URL } from '@/shared/api-constants';
import type { ApiResponseSuccess, SuccessData, Statuses } from './api-types';

export const QUERIES = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  delete: 'DELETE',
  patch: 'PATCH',
};

const STATUSES: Statuses = {
  Ok: 200,
  Created: 201,
  BadRequest: 400,
  NotFound: 404,
  TooManyRequests: 429,
  ServerError: 500,
};

export const ENGINE_ERROR = 'Car has been stopped suddenly. It`s engine was broken down';
export const NOT_FOUND_ERROR = '404 - Not Found';

function throwError(resp: unknown): void {
  if (
    resp !== null &&
    typeof resp === 'object' &&
    'status' in resp &&
    typeof resp.status === 'number' &&
    'statusText' in resp &&
    typeof resp.statusText === 'string'
  ) {
    if (resp.status === STATUSES.ServerError) {
      throw new Error(ENGINE_ERROR);
    }
    if (resp.status === STATUSES.NotFound) {
      throw new Error(NOT_FOUND_ERROR);
    }
    throw new Error(`${resp.status} - ${resp.statusText} `);
  }
  throw new Error('Invalid response');
}

function validateResponse(resp: unknown): resp is ApiResponseSuccess {
  if (
    resp !== null &&
    typeof resp === 'object' &&
    'status' in resp &&
    (resp.status === STATUSES.Ok || resp.status === STATUSES.Created)
  ) {
    return true;
  }
  return false;
}

async function response(url: string, params: RequestInit): Promise<SuccessData> {
  const res = await fetch(url, params);
  const totalCount = res.headers.get('X-Total-Count');

  if (!validateResponse(res)) {
    throwError(res);
  }

  const resp: unknown = await res.json();

  if (params.method === QUERIES.delete) {
    if (typeof resp === 'object' && resp !== null) {
      return resp;
    }
  }

  if (
    !isCars(resp) &&
    !isCar(resp) &&
    !isWinner(resp) &&
    !isWinners(resp) &&
    !isDriveMode(resp) &&
    !isCarRaceData(resp)
  ) {
    throw new Error('Failed to parse data');
  }

  if (totalCount !== null) {
    return { total: totalCount, resp };
  }

  return resp;
}

class Requests {
  private readonly baseUrl: string;

  constructor(url: string) {
    this.baseUrl = url;
  }

  public async get({
    endpoint = '',
    options = null,
  }: {
    endpoint: string;
    options?: Record<string, string> | null;
  }): Promise<SuccessData> {
    const url = this.makeUrl(endpoint, options);
    const params: RequestInit = {
      method: QUERIES.get,
    };
    const responseSuccess = await response(url, params);

    return responseSuccess;
  }

  public async post({
    endpoint = '',
    data,
  }: {
    endpoint: string;
    data: Record<string, string | number> | null;
  }): Promise<SuccessData> {
    const url = this.makeUrl(endpoint, null);
    const params: RequestInit = {
      method: QUERIES.post,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    const responseSuccess = await response(url, params);
    return responseSuccess;
  }

  public async put({
    endpoint = '',
    data,
  }: {
    endpoint: string;
    data: Record<string, string | number> | null;
  }): Promise<SuccessData> {
    const url = this.makeUrl(endpoint, null);
    const params: RequestInit = {
      method: QUERIES.put,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    const responseSuccess = await response(url, params);
    return responseSuccess;
  }

  public async delete({
    endpoint = '',
    options = null,
  }: {
    endpoint: string;
    options?: Record<string, string> | null;
  }): Promise<SuccessData> {
    const url = this.makeUrl(endpoint, options);
    const params: RequestInit = {
      method: QUERIES.delete,
    };
    const responseSuccess = await response(url, params);
    return responseSuccess;
  }

  public async patch({
    endpoint = '',
    options = null,
    signal,
  }: {
    endpoint: string;
    options?: Record<string, string> | null;
    signal?: AbortSignal;
  }): Promise<SuccessData> {
    const url = this.makeUrl(endpoint, options);
    const params: RequestInit = {
      method: QUERIES.patch,
      signal,
    };
    const responseSuccess = await response(url, params);
    return responseSuccess;
  }

  private makeUrl(endpoint: string, options: Record<string, string> | null): string {
    let url = `${this.baseUrl}${endpoint}`;

    if (options !== null) {
      const searchParams = new URLSearchParams(options);
      url += `?${searchParams.toString()}`;
    }

    return url;
  }
}

const api = new Requests(BASE_URL);
export default api;
