export interface IWeatherPayload {
  daily: {
    humidity: number;
    dt: number;
    temp: {
      day: number;
      eve: number;
      max: number;
      min: number;
      morn: number;
      night: number;
    };
  }[];
}

export enum TimeOfDay {
  DAY = "day",
  MORN = "morn",
  NIGHT = "night",
}
