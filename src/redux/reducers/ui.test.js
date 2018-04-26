import ui from "./ui";
import { openDrawer, closeDrawer } from "../actions";
import { initialState } from "../../mocks";

it("Correctly sets the openDrawer value", () => {
  const previousState = initialState.ui;
  previousState.drawer.open = false;
  const actions = [openDrawer()];
  const nextState = actions.reduce(
    (prev, action) => ui(prev, action),
    previousState
  );
  expect(nextState.drawer).toEqual({
    open: true
  });
});

it("Correctly sets the closeDrawer value", () => {
  const previousState = initialState.ui;
  previousState.drawer.open = true;
  const actions = [closeDrawer()];
  const nextState = actions.reduce(
    (prev, action) => ui(prev, action),
    previousState
  );
  expect(nextState.drawer).toEqual({
    open: false
  });
});
