export const apiMethod = {
  list: "list",
  all: "all",
  detail: "detail",
  create: "create",
  update: "update",
  delete: "delete"
};

export const detailScreenType = {
  view: "view",
  edit: "edit",
  create: "create"
};

export const apiHttpMethodMapping = {
  list: "get",
  all: "get",
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
  },
  CONSTANTS: {
    FETCH_ALL_SIZE: 100
  }
};

export default config;
