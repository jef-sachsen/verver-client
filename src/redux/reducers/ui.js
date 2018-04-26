import { CLOSE_DRAWER, OPEN_DRAWER } from "../actions";

const initialState = {
  drawer: {
    open: false
  }
};

const user = (state = initialState, action) => {
  if (action.type === OPEN_DRAWER) {
    return {
      ...state,
      drawer: {
        ...state.drawer,
        open: true
      }
    };
  } else if (action.type === CLOSE_DRAWER) {
    return {
      ...state,
      drawer: {
        ...state.drawer,
        open: false
      }
    };
  } else {
    return state;
  }
};

export default user;
