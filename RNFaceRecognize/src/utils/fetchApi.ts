import axios from 'axios';
import {CompareFaceDescriptionBody, CreateDescriptionBody} from '../types';

const hostApi = 'http://192.168.0.102:4000';

export const fetchApi = axios.create({
  baseURL: hostApi,
});

export const testApi = async () => {
  const response = await fetchApi.get('/');
  return response.data as {message: string};
};

export const createFaceDescription = async (data: CreateDescriptionBody) => {
  const response = await fetchApi.post('/create-face-description', data);
  return response.data as {face_description: string};
};

export const compareFaceDescription = async (
  data: CompareFaceDescriptionBody,
) => {
  const response = await fetchApi.post('/compare-face-with-description', data);
  return response.data as {isMatch: boolean; similar: number};
};
