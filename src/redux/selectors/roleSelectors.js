import { get } from "lodash";
import { apiMethod } from "../../config";
import { entity } from "../../lib/entity";
import { getItems, getItemById } from "./entitySelectors";

export const getRoles = getItems(apiMethod.list)(entity.role);
export const getRoleById = getItemById(apiMethod.list)(entity.role);

export const getCreateRole = state => get(state, "role.create");

export const isLoadedRoles = state =>
  !get(state, "role.list.isFetching", false) &&
  get(state, "role.list.timeFetched", true);

export const isLoadedRole = state =>
  !get(state, "role.detail.isFetching", false) &&
  get(state, "role.detail.timeFetched", true);

export const isCreatingRole = state =>
  get(state, "role.create.isFetching", false);

export const isEditedRole = state =>
  get(state, "role.update.timeFetched", false) &&
  !get(state, "role.update.error", false);

export const getCreateRoleTimeFetched = state =>
  get(state, "role.create.timeFetched", null);

export const getCreateRoleError = state =>
  get(state, "role.create.error", null);

export const isRoleWithErrors = state =>
  get(state, "role.list.error", null) || get(state, "role.detail.error", null);
