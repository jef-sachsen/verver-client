import { RESET_ROLE_CREATE_STATE } from "../actions";
import { apiReducerTemplate } from "./apiReducer";
import { entity, getInitialEntityState } from "../../lib/entity";
import { apiMethod } from "../../config";

const getInitialState = () => getInitialEntityState(entity.role);

const role = (state = getInitialState(), action) => {
  let newState = apiReducerTemplate(entity.role)(state, action);
  if (newState) {
    return newState;
  }
  if (action.type === RESET_ROLE_CREATE_STATE) {
    return {
      ...state,
      [apiMethod.create]: getInitialState()[apiMethod.create],
      [apiMethod.detail]: getInitialState()[apiMethod.detail],
      [apiMethod.update]: getInitialState()[apiMethod.update]
    };
  }
  return state;
};

export default role;
