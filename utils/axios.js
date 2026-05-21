import axios from "axios";

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
      const base_url = process.env['NEXT_PUBLIC_BASE_URL'] || "localhost:3000";
      const axiosInstance = axios.create({
        baseURL: base_url,
      });
      Axios.axiosInstance = axiosInstance;

      console.log("AXIOS INSTANCE CREATED! SETTING INTERCEPTOR");
      Axios.axiosInstance.interceptors.response.use(
        (response) => response,
        async ({ response }) => {
          console.log({ interceptorResponse: response });
          try {
            // abort if active request
            if (Axios.activeRequest) {
              console.log("Already in process of requesting new token");
              return { success: false, error: "Waiting for authentication" };
            }
            if (
              response.status === 401 &&
              response.statusText === "Unauthorized" &&
              (response.data.error.data === "jwt expired" ||
                response.data.error.data === "jwt malformed")
            ) {
              Axios.activeRequest = true;
              const resp = await Axios.axiosInstance.post(
                "/auth/refresh-token",
              );
              console.log({ respFromResp: resp });
              console.log({
                oldToken: Axios.axiosInstance.defaults.headers.common,
              });
              if (resp.status === 200) {
                Axios.setAccessToken(resp.data.accessToken);
                Axios.activeRequest = false;

                return { retry: true };
              }
            }
            return response;
          } catch (err) {
            console.log({ axiosErr: err });
            Axios.activeRequest = false;
            Axios.logout();
            throw err;
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
