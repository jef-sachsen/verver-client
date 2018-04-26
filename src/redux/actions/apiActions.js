import { apiActionType, apiMethod } from "../../config";

//API Actions
export const CONNECTION_FAILURE = "CONNECTION_FAILURE";
export const RESET_NO_CONNECTION = "RESET_NO_CONNECTION";

export const FETCH_LIST_REQUEST = "API/FETCH_LIST_REQUEST";
export const FETCH_LIST_SUCCESS = "API/FETCH_LIST_SUCCESS";
export const FETCH_LIST_FAILURE = "API/FETCH_LIST_FAILURE";

// login actions
export const FETCH_LOGIN_REQUEST = "FETCH_LOGIN_REQUEST";
export const FETCH_LOGIN_SUCCESS = "FETCH_LOGIN_SUCCESS";
export const FETCH_LOGIN_FAILURE = "FETCH_LOGIN_FAILURE";

export const FETCH_GENERIC = (type = apiActionType.request) =>
  `API/FETCH_GENERIC_${type}`;
export const FETCH_GENERIC_REQUEST = FETCH_GENERIC(apiActionType.request);
export const fetchGeneric = method => entity => payload => ({
  type: FETCH_GENERIC_REQUEST,
  method,
  entity,
  payload
});
export const FETCH_GENERIC_SUCCESS = FETCH_GENERIC(apiActionType.success);
export const fetchGenericSuccess = method => entity => data => ({
  type: FETCH_GENERIC_SUCCESS,
  method,
  entity,
  payload: {
    timeFetched: new Date(),
    data
  }
});
export const FETCH_GENERIC_FAILURE = FETCH_GENERIC(apiActionType.failure);
export const fetchGenericFailure = method => entity => error => ({
  type: FETCH_GENERIC_FAILURE,
  method,
  entity,
  payload: {
    timeFetched: new Date(),
    error
  }
});

export const fetchList = entity => parameters =>
  fetchGeneric(apiMethod.list)(entity)({ parameters });
export const fetchListSuccess = fetchGenericSuccess(apiMethod.list);
export const fetchListFailure = fetchGenericFailure(apiMethod.list);
export const fetchDetail = fetchGeneric(apiMethod.detail);
export const fetchDetailById = entity => id =>
  fetchGeneric(apiMethod.detail)(entity)({ data: { id } });
export const fetchUpdate = fetchGeneric(apiMethod.update);
export const fetchUpdateByObject = entity => data =>
  fetchGeneric(apiMethod.update)(entity)({ data });
export const fetchDelete = fetchGeneric(apiMethod.delete);
export const fetchDeleteById = entity => id =>
  fetchGeneric(apiMethod.delete)(entity)({ data: { id } });
export const fetchCreate = fetchGeneric(apiMethod.create);
export const fetchCreateByObject = entity => data =>
  fetchGeneric(apiMethod.create)(entity)({ data });

export const fetchLogin = (username, password) => ({
  type: FETCH_LOGIN_REQUEST,
  payload: {
    username,
    password
  }
});

export const fetchLoginSuccess = data => ({
  type: FETCH_LOGIN_SUCCESS,
  payload: {
    timeFetched: new Date(),
    data
  }
});

export const fetchLoginFailure = error => ({
  type: FETCH_LOGIN_FAILURE,
  payload: {
    timeFetched: new Date(),
    error
  }
});
