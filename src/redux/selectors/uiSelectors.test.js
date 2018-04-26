import { getDrawer, isDrawerOpen } from "./uiSelectors";

const state = {
  ui: {
    drawer: {
      open: true
    }
  }
};

const state2 = {
  ui: {}
};

it("getDrawer returns the correct part of the state", () => {
  const drawer = getDrawer(state);
  expect(drawer).toEqual({
    open: true
  });
  const drawer2 = getDrawer(state2);
  expect(drawer2).toEqual(undefined);
});

it("isDrawerOpen returns the correct value", () => {
  const drawer = isDrawerOpen(state);
  expect(drawer).toEqual(true);
  const drawer2 = isDrawerOpen(state2);
  expect(drawer2).toEqual(false);
});
