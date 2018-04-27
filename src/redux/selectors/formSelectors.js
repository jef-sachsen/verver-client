//Form values
export const getForm = (formName = "default") => state => state.form[formName];
export const getFormValues = formName => state =>
  (getForm(formName)(state) || {}).values;
export const getLoginFormValues = state => getFormValues("login")(state);
export const getUserFormValues = state =>
  getFormValues("UserCreateForm")(state);
export const getContactFormValues = state => getFormValues("contact")(state);
export const getGroupFormValues = state =>
  getFormValues("GroupCreateForm")(state);
export const getRoleFormValues = state =>
  getFormValues("RoleCreateForm")(state);
