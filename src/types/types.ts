export type Car = {
  id: number;
  name: string;
  color: string;
};

export type CarTemplate = {
  id?: number;
  name: string;
  color: string;
};

export type StatusEngine = 'started' | 'drive' | 'stopped';

export type EngineParams = {
  id: number;
  status: StatusEngine;
};

export const STATUS: Record<string, StatusEngine> = {
  start: 'started',
  drive: 'drive',
  stop: 'stopped',
};

export type CarRaceData = {
  velocity: number;
  distance: number;
};

export type DriveMode = {
  success: boolean;
};

export type Winner = {
  id: number;
  wins: number;
  time: number;
};

export type TableTitle = {
  key: string;
  value: string;
  cssClasses: string[];
  isSort?: boolean;
};
