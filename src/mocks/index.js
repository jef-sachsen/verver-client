export * from "./apiResponses";

export const initialState = {
  login: {
    isLoggedIn: false
  },
  ui: {
    drawer: {
      open: true
    }
  },
  user: {
    isFetching: false,
    timeFetched: null,
    items: null,
    meta: null,
    error: null
  },
  form: {},
  role: {
    isFetching: false,
    timeFetched: null,
    items: null,
    meta: null,
    create: {
      isFetching: false,
      timeFetched: null,
      items: null,
      edited: null
    }
  }
};
