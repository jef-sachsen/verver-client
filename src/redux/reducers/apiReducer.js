import {
  FETCH_GENERIC_FAILURE,
  FETCH_GENERIC_SUCCESS,
  FETCH_GENERIC_REQUEST
} from "../actions";
import {
  entity,
  checkEntity,
  getInitialEntityState,
  mergefetchRequest,
  mergefetchSuccess,
  mergefetchFailure
} from "../../lib/entity";

export const apiReducerTemplate = entity => (state, action) => {
  if (checkEntity(entity)(action.entity)) {
    if (action.type === FETCH_GENERIC_REQUEST) {
      return mergefetchRequest(action)(state);
    } else if (action.type === FETCH_GENERIC_SUCCESS) {
      return mergefetchSuccess(action)(state);
    } else if (action.type === FETCH_GENERIC_FAILURE) {
      return mergefetchFailure(action)(state);
    }
  } else {
    return undefined;
  }
};

const apiReducer = entity => (state = getInitialEntityState(entity), action) =>
  apiReducerTemplate(entity)(state, action) || state;

export default apiReducer;

export const addApiReducers = reducers => {
  Object.values(entity).forEach(e => {
    if (!reducers[e.name]) {
      reducers[e.name] = apiReducer(e);
    }
  });
  return reducers;
};
