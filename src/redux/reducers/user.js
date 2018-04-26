import { RESET_USER_CREATE_STATE } from "../actions";
import { apiReducerTemplate } from "./apiReducer";
import { entity, getInitialEntityState } from "../../lib/entity";
import { apiMethod } from "../../config";

const getInitialState = () => getInitialEntityState(entity.user);

const user = (state = getInitialState(), action) => {
  let newState = apiReducerTemplate(entity.user)(state, action);
  if (newState) {
    return newState;
  }
  if (action.type === RESET_USER_CREATE_STATE) {
    return {
      ...state,
      [apiMethod.create]: getInitialState()[apiMethod.create],
      [apiMethod.detail]: getInitialState()[apiMethod.detail],
      [apiMethod.update]: getInitialState()[apiMethod.update]
    };
  }
  return state;
};

export default user;
