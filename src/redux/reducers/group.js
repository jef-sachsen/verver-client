import { RESET_GROUP_CREATE_STATE } from "../actions";
import { apiReducerTemplate } from "./apiReducer";
import { entity, getInitialEntityState } from "../../lib/entity";
import { apiMethod } from "../../config";

const getInitialState = () => getInitialEntityState(entity.group);

const group = (state = getInitialState(), action) => {
  let newState = apiReducerTemplate(entity.group)(state, action);
  if (newState) {
    return newState;
  }
  if (action.type === RESET_GROUP_CREATE_STATE) {
    return {
      ...state,
      [apiMethod.create]: getInitialState()[apiMethod.create],
      [apiMethod.detail]: getInitialState()[apiMethod.detail],
      [apiMethod.update]: getInitialState()[apiMethod.update]
    };
  }
  return state;
};

export default group;
