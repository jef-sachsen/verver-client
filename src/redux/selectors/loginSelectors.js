import { get } from "lodash";
import { getItemById } from ".";
import { entity } from "../../lib/entity";

export const getLogin = (key = "isLoggedIn") => state => state.login[key];
export const getLoginError = state => getLogin("error")(state);

export const getUserIdFromToken = state => get(state, "login.decodedJwt.id");
export const getContactIdFromToken = state => {
  const userId = getUserIdFromToken(state);
  if (!userId) return undefined;
  const user = getItemById(entity.user)(userId)(state);
  return (user && user.contact) || undefined;
};
