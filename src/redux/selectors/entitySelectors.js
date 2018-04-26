import { find, get } from "lodash";

export const getEntity = ({ name }) => state => state[name];
export const getEntityMethod = method => entity => state =>
  (getEntity(entity)(state) || {})[method];
export const getEntityMethodValue = key => method => entity => state =>
  (getEntityMethod(method)(entity)(state) || {})[key];
export const getEntityItems = entity => state =>
  get(getEntity(entity)(state), "items") || [];
// Use preferably the ones below to create selectors.
export const getItems = method => entity => state => {
  const allItems = getEntityItems(entity)(state);
  const itemIds = getEntityMethodValue("items")(method)(entity)(state) || [];
  return allItems.filter(item => itemIds.includes(item.id));
};
export const getMeta = getEntityMethodValue("meta");
export const getError = getEntityMethodValue("error");
export const getTimeFetched = getEntityMethodValue("timeFetched");
export const getIsFetching = getEntityMethodValue("isFetching");

export const getItemById = method => entity => id => state => {
  const items = getItems(method)(entity)(state);
  return find(items, item => item.id === id);
};
