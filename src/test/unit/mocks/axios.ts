import axios from 'axios';

export const mockAxios = (): typeof axios => {
  axios.create({
    baseURL: 'https://test.com',
  });
  axios.get = jest.fn();
  axios.post = jest.fn();
  axios.put = jest.fn();
  axios.delete = jest.fn();
  return axios;
};
