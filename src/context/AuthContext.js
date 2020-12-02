import React, { createContext, useReducer } from "react";
import { AppReducer } from "./AppReducer";

const initialState = {
  auth: false,
  loading: true,
  postLength: null
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

  function setPostLength(length) {
    if (typeof length === "string") {
      length = state.postLength + 1
    }
    dispatch({
      type: "SET_POST_LENGTH",
      payload: length
    })
  }

  return (
    <AuthContext.Provider value={{
      auth: state.auth,
      loading: state.loading,
      postLength: state.postLength,
      setAuth,
      setPostLength
    }}>
      {children}
    </AuthContext.Provider>
  )
}
