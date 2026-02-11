"use client";
import Axios from "../../utils/axios";
import { createContext, useEffect, useReducer } from "react";

const initialAuthState = {
  user: null,
  email: null,
  isLogged: false,
  role: null,
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

  function login(accesToken, email, role) {
    Axios.setAccessToken(accesToken);
    localStorage.setItem("SESSION", "ESTABLISHED");
    dispatch({
      type: "LOGIN",
      payload: {
        email,
        role,
      },
    });
  }

  useEffect(() => {
    // register axios logout -> used on axios interceptor
    Axios.logout = () => {
      console.log("ar trebui sa logout");
      localStorage.setItem("SESSION", 'DROPPED')
      dispatch({
        type: "LOGOUT",
        payload: initialAuthState,
      });
    };
    // try to get new access token
    async function setSession() {
      try {
        const resp = await Axios.axiosInstance.post("/auth/refresh-token");
        console.log({ resp });
        if (resp?.status === 200 && resp?.data?.accessToken) {
          console.log("Session initialized by quering new access token");
          login(resp.data.accesToken, resp.data.user.email, "regular");
          return;
        }
        console.log("Cant init session auth");
      } catch (err) {
        console.log(err);
      }
    }
    if (localStorage.getItem("SESSION") === "ESTABLISHED") setSession();
  }, []);

  return (
    <Auth.Provider value={{ ...state, login, initialize }}>
      {children}
    </Auth.Provider>
  );
}
