import React, { createContext, useReducer } from "react";
import { AppReducer } from "./AppReducer";

const initialState = {
  posts: null,
  postLength: null,
  postsLoading: true
}

export const PostsContext = createContext(initialState)

export const PostsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState)

  function setPosts(posts) {
    dispatch({
      type: "SET_POSTS",
      payload: posts
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
    <PostsContext.Provider value={{
      posts: state.posts,
      postLength: state.postLength,
      postsLoading: state.postsLoading,
      setPosts,
      setPostLength
    }}>
      {children}
    </PostsContext.Provider>
  )
}
