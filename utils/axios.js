import axios from "axios";

export default class Axios {
  static axiosInstance = null;

  constructor() {
    throw new Error(
      "Axios instance can t be created dirrectly. Please user Axios.createInstance() instead"
    );
  }

  static getAxiosInstance(config) {
    if (!this.axiosInstance) {
      this.axiosInstance = axios.create(config);
    }
    return this.axiosInstance;
  }

  static setAccessToken(token) {
    if (!this.axiosInstance)
      throw new Error("Can`t set access token before axios initialization");
    console.log("setting authorization header for future requests");
    this.axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}
