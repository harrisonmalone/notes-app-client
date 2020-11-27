import React, { createContext, useReducer } from "react";
import { AppReducer } from "./AppReducer";

const initialState = {
  auth: false,
  loading: true
}

export const AuthContext = createContext(initialState)

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState)

  function setAuth(auth) {
    dispatch({
      type: "SET_AUTH",
      payload: auth
    })
  }

  return (
    <AuthContext.Provider value={{
      auth: state.auth,
      loading: state.loading,
      setAuth
    }}>
      {children}
    </AuthContext.Provider>
  )
}
