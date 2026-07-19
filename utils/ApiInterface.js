import Axios from "./axios";
import { CustomError } from "./CustomError";

const axiosInstance = Axios.initialize();

function expiredTokenHandler(method) {
  return async (...requestParameters) => {
    try {
      let response = await method(...requestParameters);
      if (response?.retry) {
        response = await method(...requestParameters);
      }
      console.log({ response });
      const {
        data: { success, data: apiData, error },
      } = response || {
        data: {
          success: "null",
          data: null,
          error: null,
        },
      };
      if (!success) {
        if (response?.status === "in progress")
          throw new CustomError(
            "Waiting for renew auth",
            4001,
            "Acces token expired",
          );
        throw new Error(error.message || "Request error");
      }
      return apiData;
    } catch (err) {
      if(err instanceof CustomError)
        throw err;
      Axios?.logout();
    }
  };
}

function crudGenerator() {
  return {
    get: expiredTokenHandler(axiosInstance.get),
    post: expiredTokenHandler(axiosInstance.post),
    patch: expiredTokenHandler(axiosInstance.patch),
    delete: expiredTokenHandler(axiosInstance.delete),
  };
}

const ApiInterface = {
  ...crudGenerator(),
};

export default ApiInterface;
