import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

import login from "./login";
import ui from "./ui";
import { addApiReducers } from "./apiReducer";
import group from "./group";
import role from "./role";
import user from "./user";

const reducers = {
  login,
  ui,
  group,
  role,
  user,
  form: formReducer
};

const enhancedReducers = addApiReducers(reducers);

export const getRootReducer = combineReducers(enhancedReducers);

export default enhancedReducers;
