import config from "../config";

const getErrorPromise = error => {
  console.log("Handled Connection Error", error);
  return new Promise((resolve, reject) => {
    resolve({
      ok: false,
      json: () =>
        new Promise((resolve, reject) => {
          resolve(error);
        })
    });
  });
};

const handleFetchErrors = (errorMessage, statusCode) => {
  const error = {
    statusCode: 503,
    devMessage: "An error ocurred while trying to connect to the API.",
    error: config.ERROR.NOCONNECTION
  };
  return getErrorPromise(error);
};

const getQueryFromParams = (parameters = {}) =>
  Object.keys(parameters || {}).reduce((result, parameter) => {
    if (!parameter || !parameters[parameter]) return result;
    return result === ""
      ? `${parameter}=${parameters[parameter]}`
      : `${result}&${parameter}=${parameters[parameter]}`;
  }, "");

const getHeaders = token => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8"
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return new Headers(headers);
};

const get = async (request, token) => {
  const { endpoint, parameters } = request;
  const query = getQueryFromParams(parameters);
  return fetch(`${config.apiBaseUrl}/${endpoint}?${query}`, {
    method: "get",
    headers: getHeaders(token)
  }).catch(handleFetchErrors);
};

const post = async (request, token) => {
  const { endpoint, parameters, data } = request;
  const query = getQueryFromParams(parameters);
  return fetch(`${config.apiBaseUrl}/${endpoint}?${query}`, {
    method: "post",
    body: JSON.stringify(data),
    headers: getHeaders(token)
  }).catch(handleFetchErrors);
};

const put = async (request, token) => {
  const { endpoint, parameters, data } = request;
  const query = getQueryFromParams(parameters);
  return fetch(`${config.apiBaseUrl}/${endpoint}?${query}`, {
    method: "put",
    body: JSON.stringify(data),
    headers: getHeaders(token)
  }).catch(handleFetchErrors);
};

const del = async (request, token) => {
  const { endpoint, parameters, data } = request;
  const query = getQueryFromParams(parameters);
  return fetch(`${config.apiBaseUrl}/${endpoint}?${query}`, {
    method: "delete",
    body: JSON.stringify(data),
    headers: getHeaders(token)
  }).catch(handleFetchErrors);
};

/**
 * use this function to create a new api template which stores username and password
 */
const createApi = token => ({
  setToken: token => {
    this.token = token;
  },
  getToken: () => this.token,
  get: request => get(request, this.token),
  post: request => post(request, this.token),
  put: request => put(request, this.token),
  del: request => del(request, this.token)
});

/**
 * use this function to create a new api objet.
 * @param {*} baseUrl
 * @param {*} username
 * @param {*} password
 */
const create = (baseUrl = config.apiBaseUrl, token) => {
  const api = createApi();

  if (token) {
    api.setToken(token);
  }

  return api;
};

export default {
  create
};
