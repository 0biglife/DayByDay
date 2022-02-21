import axios from 'axios';
import {Article} from '../model/data';

const baseurl = 'http://localhost:1337';

const client = axios.create({
  baseURL: baseurl,
});

export default client;

export const getArticles = async () => {
  const response = await client.get<Article[]>('/articles');
  return response.data;
};

export const applyToken = (jwt: string) => {
  console.log('Apply Token by Client : ', jwt);
  client.defaults.headers.common.Authorization = `Bearer ${jwt}`;
};

export const clearToken = () => {
  console.log('Delete Token by Client');
  client.defaults.headers.common.Authorization = '';
};
