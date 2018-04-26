export const getDrawer = state => state.ui.drawer;

export const isDrawerOpen = state => {
  const drawer = getDrawer(state);
  if (!drawer) return false;
  return !!drawer.open;
};
