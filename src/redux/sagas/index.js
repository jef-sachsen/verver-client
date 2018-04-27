import { all, put, takeLatest, call } from "redux-saga/effects";
import { push } from "react-router-redux";
import { get } from "lodash";
import apiCreator from "../../lib/api";
import config, { apiMethod, apiHttpMethodMapping } from "../../config";
import jwtDecode from "jwt-decode";
import { REHYDRATE } from "redux-persist";
import {
  fetchLoginSuccess,
  fetchLoginFailure,
  reduxRehydrationCompleted,
  fetchGenericSuccess,
  fetchGenericFailure,
  fetchAll
} from "../actions";
import {
  LOGOUT,
  FETCH_LOGIN_REQUEST,
  FETCH_LOGIN_SUCCESS,
  FETCH_GENERIC_REQUEST,
  FETCH_GENERIC_SUCCESS
} from "../actions";
import { takeEvery } from "redux-saga";

/**
 * create the default api here. it will be replaced
 * once the user logs in successfully
 */
let api = apiCreator.create();

const handleResponseJsonError = (errorMessage, statusCode) => {
  return new Promise((resolve, reject) => {
    const error = {
      error: config.ERROR.UNPARSABLE_RESPONSE
    };
    resolve(error);
  });
};

export function* handleResponse(
  response,
  actionSuccess,
  actionFailure,
  callIfSuccess,
  ...rest
) {
  let data = yield response.json().catch(handleResponseJsonError);
  if (response.ok) {
    //This is temporary.. the api is not responding as expected..
    if (!data.content && !data.access_token) {
      data = {
        content: data
      };
    }
    if (actionSuccess) {
      yield put(actionSuccess(data));
    }
    if (callIfSuccess) {
      yield call(callIfSuccess, data, ...rest);
    }
  } else {
    if (actionFailure) {
      yield put(actionFailure(data));
    }
    if (response.status === 401) {
      yield put(push("/login"));
    }
  }
}

export function* fetchSaga(api, action) {
  const { payload, method, entity } = action;
  const { parameters, data } = payload || {};
  const request = {
    endpoint: entity.endpoint,
    parameters,
    data
  };
  if (method === apiMethod.list) {
    // no todo yet
  } else if (method === apiMethod.all) {
    // no todo yet
  } else if (method === apiMethod.detail) {
    request.endpoint = `${entity.endpoint}/${data.id}`;
  } else if (method === apiMethod.create) {
    // no todo yet
  } else if (method === apiMethod.update) {
    request.endpoint = `${entity.endpoint}/${data.id}`;
  } else if (method === apiMethod.delete) {
    request.endpoint = `${entity.endpoint}/${data.id}`;
  } else {
    console.error("Unrecognized API Action");
    return;
  }
  const response = yield call(api[apiHttpMethodMapping[method]], request);
  yield call(
    handleResponse,
    response,
    fetchGenericSuccess(method)(entity),
    fetchGenericFailure(method)(entity)
  );

  // after delete we need to update state containing all entities of a kind (e.g. all roles, all users)
  // so we do it manually
  if (method === apiMethod.delete) {
    const response = yield call(
      api[apiHttpMethodMapping[apiMethod.list]],
      Object.assign({}, request, {
        endpoint: entity.endpoint
      })
    );
    yield call(
      handleResponse,
      response,
      fetchGenericSuccess(apiMethod.list)(entity),
      fetchGenericFailure(apiMethod.list)(entity)
    );
  }
}

export function* fetchSuccessSaga(action) {
  const { method, entity, payload = {} } = action;
  const { data: { meta } } = payload || {};
  if (method === apiMethod.delete || method === apiMethod.create) {
    yield put(push(`/${entity.name}/list`));
  }
  if (method === apiMethod.all) {
    if (meta && meta.hasNext && (meta.page || meta.page === 0)) {
      yield put(fetchAll(entity)(meta.page + 1));
    }
  }
}

export function* fetchLoginSuccessCallback(data) {
  const { access_token } = data;
  let decodedJwt = null;
  try {
    decodedJwt = jwtDecode(access_token);
  } catch (e) {
    console.error("Error decoding the received JWT Token: ", e);
  }
  if (!decodedJwt) {
    const error = {
      statusCode: 403,
      devMessage: "Couldn't decode JWT.",
      error: config.ERROR.UNAUTHORIZED
    };
    yield put(fetchLoginFailure(error));
  } else {
    yield put(fetchLoginSuccess({ ...data, decodedJwt }));
  }
}

export function* fetchLoginSaga(api, action) {
  const { username, password } = action.payload || {};
  const request = {
    endpoint: "login",
    parameters: null,
    data: {
      username,
      password
    }
  };
  const response = yield call(api.post, request);
  yield call(
    handleResponse,
    response,
    null,
    fetchLoginFailure,
    fetchLoginSuccessCallback
  );
}

export function* handleSuccessfulLogin(action) {
  const { data: { access_token } } = action.payload;
  api.setToken(access_token);
  //redirect the user to the main page
  yield put(push("/role/create"));
}

export function* reduxRehydrateSaga(api, action) {
  const { payload = {} } = action;
  const access_token = get(payload, "login.access_token");
  if (!api.getToken() && access_token) {
    api.setToken(access_token);
  }
  yield put(reduxRehydrationCompleted());
}

export function* handleLogout(action) {
  yield put(push("/login"));
}

export default function* root() {
  yield all([
    takeLatest(REHYDRATE, reduxRehydrateSaga, api),
    takeEvery(FETCH_GENERIC_REQUEST, fetchSaga, api),
    takeEvery(FETCH_GENERIC_SUCCESS, fetchSuccessSaga),
    takeLatest(FETCH_LOGIN_REQUEST, fetchLoginSaga, api),
    takeLatest(FETCH_LOGIN_SUCCESS, handleSuccessfulLogin),
    takeLatest(LOGOUT, handleLogout)
  ]);
}
