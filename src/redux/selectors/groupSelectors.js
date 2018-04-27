import { get } from "lodash";
import { apiMethod } from "../../config";
import { entity } from "../../lib/entity";
import { getItems, getItemById } from "./entitySelectors";

export const getGroups = getItems(apiMethod.list)(entity.group);
export const getGroupById = getItemById(entity.group);

export const isLoadedGroups = state =>
  !get(state, "group.list.isFetching", false) &&
  get(state, "group.list.timeFetched", true);

export const isLoadedGroup = state =>
  !get(state, "group.detail.isFetching", false) &&
  get(state, "group.detail.timeFetched", true);

export const isCreatingGroup = state =>
  get(state, "group.create.isFetching", false);

export const getCreateGroupTimeFetched = state =>
  get(state, "group.create.timeFetched", null);

export const getCreateGroupError = state =>
  get(state, "group.create.error", null);

export const isEditedGroup = state =>
  get(state, "group.update.timeFetched", false) &&
  !get(state, "group.update.error", false);

export const isGroupWithErrors = state =>
  get(state, "group.list.error", null) ||
  get(state, "group.detail.error", null);
