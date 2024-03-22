export type Car = {
  id: number;
  name: string;
  color: string;
};

export type EngineParams = {
  id: number;
  status: StatusEngine;
};

export type StatusEngine = 'started' | 'stopped';

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
