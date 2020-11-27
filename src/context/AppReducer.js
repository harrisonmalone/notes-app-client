export const AppReducer = (state, action) => {
  switch(action.type) {
    case "SET_AUTH": 
      return {
        ...state,
        auth: action.payload.auth,
        loading: action.payload.loading
      }
    default: 
      return state
  }
}