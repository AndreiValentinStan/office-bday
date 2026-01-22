"use client";
import { createContext, useReducer } from "react";

export const Auth = createContext({});

const initialAuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLogged: false,
  role: null,
};

function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case "LOGIN":
      console.log("dispatch login");
      return {
        ...state,
        user: {
          id: "123",
          email: "test@email.com",
        },
        role: "ADMIN",
      };
    default:
      console.log("auth default case");
      return state;
  }
}

export default function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(initialAuthState, reducer);

  function login(value) {
    console.log(value);
  }

  return <Auth.Provider value={{ state, login }}>{children}</Auth.Provider>;
}
