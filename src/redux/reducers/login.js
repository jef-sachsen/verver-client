import {
  LOGOUT,
  FETCH_LOGIN_REQUEST,
  FETCH_LOGIN_SUCCESS,
  FETCH_LOGIN_FAILURE
} from "../actions";

const initialState = {
  isLoggedIn: false,
  isFetching: false,
  timeFetched: null,
  access_token: null,
  token_type: null,
  expires_in: null,
  decodedJwt: null
};

const login = (state = initialState, action) => {
  if (action.type === FETCH_LOGIN_REQUEST) {
    return {
      ...state,
      isFetching: true
    };
  } else if (action.type === FETCH_LOGIN_SUCCESS) {
    const { data, timeFetched } = action.payload;
    return {
      ...state,
      ...data,
      timeFetched,
      isLoggedIn: true,
      isFetching: false
    };
  } else if (action.type === FETCH_LOGIN_FAILURE) {
    const { error, timeFetched } = action.payload;
    return {
      ...state,
      error,
      timeFetched,
      isLoggedIn: false,
      isFetching: false
    };
  } else if (action.type === LOGOUT) {
    return initialState;
  } else {
    return state;
  }
};

export default login;
