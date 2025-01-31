import axios from "axios";
//@ts-ignore
import { API_URL } from '@env';
import RNStart from "react-native-restart"
console.log(API_URL)
const VITE_SERVER_URL = API_URL;

let BaseURL = "/api/v1/";
if (VITE_SERVER_URL) BaseURL = VITE_SERVER_URL + BaseURL;

const apiClient = axios.create({
  baseURL: BaseURL,
  withCredentials: true,
});



const setupInterceptors = (): void => {
  // Example interceptor setup

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log(error)
      const errorMessage = error.response?.data?.message
      if (
        errorMessage === "please login to access this resource" ||
        errorMessage === "login again ! session expired" ||
        errorMessage === "login again"
      ) {
        RNStart.restart()
      }
      return Promise.reject(error);
    },
  );
};
const multipartHeaders = {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
}

export { BaseURL, multipartHeaders, apiClient, setupInterceptors };