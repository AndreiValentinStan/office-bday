import axios from "axios";

let requestsQueue = [];

function processQueue(error, token) {
  requestsQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    }
    promise.resolve(token);
  });
  requestsQueue = [];
}

let isRefreshing = false;

export default class Axios {
  static axiosInstance = null;
  static interceptor = false;
  static activeRequest = false;
  static logout = null;

  constructor() {
    throw new Error(
      "Axios instance can t be created dirrectly. Please user Axios.createInstance() instead",
    );
  }

  static initialize() {
    console.log("GETTING AXIOS INSTANCE");
    if (!Axios.axiosInstance) {
      console.log("AXIOS INSTANCE NOT FOUND! CREATING NEW ONE!");
      const base_url = process.env["NEXT_PUBLIC_BASE_URL"] || "localhost:3000";
      const axiosInstance = axios.create({
        baseURL: base_url,
      });
      Axios.axiosInstance = axiosInstance;

      console.log("AXIOS INSTANCE CREATED! SETTING INTERCEPTOR");
      Axios.axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;
          if (originalRequest._retry && error.request.status !== 401) {
            const errorMessage =
              error?.response?.data?.error?.message || error?.message;
            return Promise.reject({ message: errorMessage, logoff: false });
          }
          if (isRefreshing) {
            return new Promise((res, rej) => {
              requestsQueue.push({ resolve: res, reject: rej });
            })
              .then((token) => {
                originalRequest.headers["Authorization"] = `Bearer=${token}`;
                return Axios.axiosInstance(originalRequest);
              })
              .catch((err) =>
                Promise.reject({ message: err.message, logoff: true }),
              );
          }
          isRefreshing = true;
          originalRequest._retry = true;

          try {
            const {
              data: { accessToken },
            } = await axios.post("/api/auth/refresh-token");

            Axios.setAccessToken(accessToken);
            originalRequest.headers["Authorization"] = `Bearer=${accessToken}`;
            processQueue(null, accessToken);
            return Axios.axiosInstance(originalRequest);
          } catch (err) {
            const message = err?.response?.data?.error?.message || err?.message;
            processQueue(err, null);
            return Promise.reject({ message, logoff: true });
          } finally {
            isRefreshing = false;
          }
        },
      );
    }
    return Axios.axiosInstance;
  }

  static setAccessToken(token) {
    if (!Axios.axiosInstance)
      throw new Error("Can`t set access token before axios initialization");
    console.log("setting authorization header for future requests");
    Axios.axiosInstance.defaults.headers.common["Authorization"] =
      `Bearer=${token}`;
  }
}
