import Axios from "./axios";

const axiosInstance = Axios.initialize();

function expiredTokenHandler(method) {
  return async (...requestParameters) => {
    try {
      let response = await method(...requestParameters);
      if (response?.retry) {
        response = await method(...requestParameters);
      }
      const {
        data: { success, data: apiData, error },
      } = response || {
        data: {
          success: 'null',
          data: null,
          error: null,
        },
      };
      if (!success) {
        throw new Error(error.message || "Request error");
      }
      return apiData;
    } catch (err) {
      throw err;
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
