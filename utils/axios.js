import axios from "axios";

export default class Axios {
  static axiosInstance = null;

  constructor() {
    throw new Error(
      "Axios instance can t be created dirrectly. Please user Axios.createInstance() instead"
    );
  }

  static getAxiosInstance() {
    if (!this.axiosInstance) {
      const base_url = process.env.NEXT_PUBLIC_BASE_URL || 'localhost:3000';
      this.axiosInstance = axios.create({
        baseURL: base_url,
      });
    }
    return this.axiosInstance;
  }

  static setAccessToken(token) {
    if (!this.axiosInstance)
      throw new Error("Can`t set access token before axios initialization");
    console.log("setting authorization header for future requests");
    this.axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  }
}
