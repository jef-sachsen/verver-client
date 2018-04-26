import {
  getItems,
  getItemById,
  getIsFetching,
  getTimeFetched
} from "./entitySelectors";
import { entity } from "../../lib/entity";
import { apiMethod } from "../../config";
import { get } from "lodash";

export const getUsers = getItems(apiMethod.list)(entity.user);
export const getUserById = getItemById(apiMethod.list)(entity.user);
export const isFetchingUserList = getIsFetching(apiMethod.list)(entity.user);
export const getTimeFetchedUserList = getTimeFetched(apiMethod.list)(
  entity.user
);

export const isCreatingUser = state =>
  get(state, "user.create.isFetching", false);

export const isEditedUser = state => {
  return (
    get(state, "user.update.timeFetched", false) &&
    !get(state, "user.update.error", false)
  );
};

export const getCreateUserError = state =>
  get(state, "user.create.error", null);

export const isUserWithErrors = state =>
  get(state, "user.list.error", null) || get(state, "user.detail.error", null);

export const isLoadedUsers = state =>
  !get(state, "user.list.isFetching", false) &&
  get(state, "user.list.timeFetched", true);

export const isLoadedUser = state =>
  !get(state, "user.detail.isFetching", false) &&
  get(state, "user.detail.timeFetched", true);

//keep for legacy code
export const isFetchingUsers = isFetchingUserList;
export const getTimeFetchedUsers = getTimeFetchedUserList;
