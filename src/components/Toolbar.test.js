import React from "react";
import { shallow } from "enzyme";
import { Toolbar } from "./Toolbar";

const props = {
  t: jest.fn(),
  classes: {},
  theme: {},
  logout: jest.fn(),
  openDrawer: jest.fn(),
  open: false
};

it("renders without crashing", () => {
  shallow(<Toolbar {...props} />);
});

it("renders an multiple MenuItems", () => {
  const component = shallow(<Toolbar {...props} />);
  const MenuItems = component.find("WithStyles(MenuItem)");
  expect(MenuItems.length).toBeGreaterThan(1);
});

it("renders a Menu", () => {
  const wrapper = shallow(<Toolbar {...props} />);
  const component = wrapper.find("WithStyles(Menu)");
  expect(component).toHaveLength(1);
});

it("renders 2 IconButtons", () => {
  const wrapper = shallow(<Toolbar {...props} />);
  const component = wrapper.find("WithStyles(IconButton)");
  expect(component).toHaveLength(2);
});
