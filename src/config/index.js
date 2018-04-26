export const apiMethod = {
  list: "list",
  detail: "detail",
  create: "create",
  update: "update",
  delete: "delete"
};

export const apiHttpMethodMapping = {
  list: "get",
  detail: "get",
  create: "post",
  update: "put",
  delete: "del"
};

export const apiActionType = {
  request: "REQUEST",
  success: "SUCCESS",
  failure: "FAILURE"
};

export const config = {
  apiBaseUrl:
    process.env.NODE_ENV === "development"
      ? "https://api.swt.leoek.eu"
      : "https://api.swt.leoek.eu",
  ERROR: {
    NOCONNECTION: "NOCONNECTION",
    UNAUTHORIZED: "UNAUTHORIZED"
  }
};

export default config;
