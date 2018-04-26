import {
  getItems,
  getItemById,
  getIsFetching,
  getTimeFetched
} from "./entitySelectors";
import { entity } from "../../lib/entity";
import { apiMethod } from "../../config";

export const getContacts = getItems(apiMethod.list)(entity.contact);
export const getContactById = getItemById(apiMethod.list)(entity.contact);
export const isFetchingContactList = getIsFetching(apiMethod.list)(
  entity.contact
);
export const getTimeFetchedContactList = getTimeFetched(apiMethod.list)(
  entity.contact
);
