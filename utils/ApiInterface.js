import Axios from "./axios";

const axiosInstance = Axios.initialize();

function expiredTokenHandler(method) {
  return async (...requestParameters) => {
    try {
      let response = await method(...requestParameters);
      if (response?.retry) {
        response = await method(...requestParameters);
      }
      if (!response || response?.status !== 200 || !response?.data?.success) {
        if (response?.data?.error) throw Error(response?.data?.error?.message);
        throw Error("Request error occured!");
      }
      return response.data.data;
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
  };
}

const ApiInterface = {
  ...crudGenerator(),
};

export default ApiInterface;
