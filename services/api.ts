import axios from 'axios';

const BASE_URL = 'http://192.168.1.44:8000';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

export interface TrainEvent {
  raw: string;
  type: 'Arrived' | 'Departed' | null;
  station: string | null;
  code: string | null;
  datetime: string | null;
  delay: string | null;
}

export interface TrainStatus {
  train_number: number;
  start_date: string | null;
  last_update: string | null;
  events: TrainEvent[];
}

export const getTrainStatus = async (
  trainNumber: string
): Promise<TrainStatus> => {
  const response = await api.get<TrainStatus>(`/train/${trainNumber}`);
  return response.data;
};