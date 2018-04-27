import { isEmpty, unionBy } from "lodash";
import { apiMethod } from "../config";

export const checkEntity = (entity1 = {}) => (entity2 = {}) =>
  entity1.name && !isEmpty(entity1.name) && entity1.name === entity2.name;

export const getInitialEntityState = entity => {
  const state = {
    entity,
    items: []
  };
  Object.values(apiMethod).forEach(method => {
    state[method] = {
      isFetching: false,
      timeFetched: null,
      items: null,
      meta: null,
      edited: null
    };
  });
  return state;
};

export const mergefetchRequest = action => state => {
  const { method } = action;
  if (apiMethod[method]) {
    return {
      ...state,
      [method]: {
        ...state[method],
        isFetching: true,
        error: null
      }
    };
  }
  return state;
};
export const mergefetchSuccess = action => state => {
  const { method, payload = {} } = action;
  const { data: { content, meta }, timeFetched } = payload;
  const items = Array.isArray(content) ? content : [content];
  const enhancedItems = items.map(item => ({ ...item, timeFetched }));
  if (apiMethod[method]) {
    return {
      ...state,
      items: unionBy(enhancedItems, state.items, "id"),
      [method]: {
        ...state[method],
        isFetching: false,
        items: items.map(item => item && item.id),
        meta,
        timeFetched
      }
    };
  }
  return state;
};
export const mergefetchFailure = action => state => {
  const { method, payload = {} } = action;
  const { error, timeFetched } = payload;
  if (apiMethod[method]) {
    return {
      ...state,
      [method]: {
        ...state[method],
        isFetching: false,
        error,
        timeFetched
      }
    };
  }
  return state;
};

export const entity = {
  user: {
    name: "user",
    endpoint: "users"
  },
  contact: {
    name: "contact",
    endpoint: "contacts"
  },
  permission: {
    name: "permission",
    endpoint: "permissions"
  },
  role: {
    name: "role",
    endpoint: "roles"
  },
  group: {
    name: "group",
    endpoint: "groups"
  }
};

export default entity;
