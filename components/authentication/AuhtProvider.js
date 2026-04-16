"use client";
import Axios from "../../utils/axios";
import { createContext, useEffect, useReducer } from "react";

const initialAuthState = {
  user: null,
  email: null,
  isLogged: false,
  role: null,
  firstName: null,
  lastName: null,
  phone: null,
  isSetteled: false,
};

export const Auth = createContext(initialAuthState);

function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case "LOGIN":
      return {
        ...state,
        ...payload,
        isLogged: true,
      };
    case "SET_SESSION":
      return {
        ...state,
        isLogged: true,
      };
    case "INITIALIZE":
      return {
        ...state,
        axios: payload.axios,
      };
    case "LOGOUT":
      return {
        ...state,
        ...payload,
      };
    case "UPDATE USER":
      return {
        ...state,
        ...payload,
      };
    case "SETTLED":
      return {
        ...state,
        isSetteled: payload,
      };
    default:
      console.log("auth default case");
      return state;
  }
}

export default function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  function initialize() {
    Axios.initialize();
    /* Axios.logout = () => {
      dispatch({
        type: 'LOGOUT',
        payload: initialAuthState
      })
    } */
  }

  function logout() {
    localStorage.setItem("SESSION", "DROPPED");
    dispatch({
      type: "LOGOUT",
      payload: initialAuthState,
    });
  }

  function login(accesToken, email, role, firstName, lastName, phone) {
    Axios.setAccessToken(accesToken);
    localStorage.setItem("SESSION", "ESTABLISHED");
    dispatch({
      type: "SETTLED",
      payload: true,
    });
    dispatch({
      type: "LOGIN",
      payload: {
        email,
        role,
        firstName,
        lastName,
        phone,
      },
    });
  }

  function updateUserData(userData) {
    dispatch({
      type: "UPDATE USER",
      payload: {
        ...userData,
      },
    });
  }

  function getUserInfo(...attributes) {
    return Object.keys(state)
      .filter((key) => {
        return attributes.includes(key);
      })
      .reduce((accumulator, currentKey) => {
        return {
          ...accumulator,
          [currentKey]: state[currentKey],
        };
      }, {});
  }

  useEffect(() => {
    // register axios logout -> used on axios interceptor
    Axios.logout = () => {
      console.log("ar trebui sa logout");
      localStorage.setItem("SESSION", "DROPPED");
      dispatch({
        type: "LOGOUT",
        payload: initialAuthState,
      });
    };
    // try to get new access token
    async function setSession() {
      try {
        const resp = await Axios.axiosInstance.post("/auth/refresh-token");
        if (resp?.status === 200 && resp?.data?.accessToken) {
          console.log("Session initialized by quering new access token");
          const { firstName, lastName, phone } = resp.data.user;
          login(
            resp.data.accesToken,
            resp.data.user.email,
            "regular",
            firstName,
            lastName,
            phone,
          );
          return;
        }
        console.log("Cant init session auth");
      } catch (err) {
        console.log(err);
      } finally {
        dispatch({
          type: "SETTLED",
          payload: true,
        });
      }
    }
    console.log(localStorage.getItem("SESSION"));
    if (localStorage.getItem("SESSION") === "ESTABLISHED") setSession();
    else
      dispatch({
        type: "SETTLED",
        payload: true,
      });
  }, []);

  /* useEffect(() => {

  }, []) */

  return (
    <Auth.Provider
      value={{
        ...state,
        login,
        initialize,
        getUserInfo,
        updateUserData,
        logout,
      }}
    >
      {children}
    </Auth.Provider>
  );
}
