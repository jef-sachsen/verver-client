export const getLogin = (key = "isLoggedIn") => state => state.login[key];
export const getLoginError = state => getLogin("error")(state);
