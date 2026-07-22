import Axios from "./axios";

const axiosInstance = Axios.initialize();

function expiredTokenHandler(method) {
  return async (...requestParameters) => {
    try {
      let response = await method(...requestParameters);

      const {
        data: { success, data: apiData, error },
      } = response || {
        data: {
          success: "null",
          data: null,
          error: null,
        },
      };

      return apiData;
    } catch (err) {
      console.log({ err });
      if (err?.logoff) Axios?.logout();
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
