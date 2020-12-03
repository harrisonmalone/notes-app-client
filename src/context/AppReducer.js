export const AppReducer = (state, action) => {
  switch(action.type) {
    case "SET_AUTH": 
      return {
        ...state,
        auth: action.payload.auth,
        loading: action.payload.loading
      }
    case "SET_POST_LENGTH":
      return {
        ...state,
        postLength: action.payload
      }
    case "SET_POSTS":
      return {
        ...state,
        posts: action.payload,
        postsLoading: false
      }
    default: 
      return state
  }
}