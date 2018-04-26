import { get } from "lodash";
import { apiMethod } from "../../config";
import { entity } from "../../lib/entity";
import { getItems, getItemById } from "./entitySelectors";

export const getPermissions = getItems(apiMethod.list)(entity.permission);
export const getPermissionById = getItemById(apiMethod.list)(entity.permission);

export const isFetchingPermissions = state =>
  !!get(state, `${entity.permission.name}.list.isFetching`);

export const getTimeFetchedPermissions = state =>
  get(state, `${entity.permission.name}.list.timeFetched`);
