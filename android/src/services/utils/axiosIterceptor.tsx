import axios from "axios";
//@ts-ignore
import { API_URL } from '@env';
console.log(API_URL)
const VITE_SERVER_URL = API_URL;

let BaseURL = "/api/v1/";
if (VITE_SERVER_URL) BaseURL = VITE_SERVER_URL + BaseURL;

const apiClient = axios.create({
  baseURL: BaseURL,
  withCredentials: true,
});

const multipartHeaders = {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
}

export { BaseURL, multipartHeaders, apiClient };
