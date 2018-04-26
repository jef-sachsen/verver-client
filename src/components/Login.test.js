import React from "react";
import { shallow } from "enzyme";
import { Login } from "./Login";

it("renders without crashing", () => {
  shallow(<Login t={jest.fn()} />);
});

it("has exactly one LoginForm", () => {
  const component = shallow(<Login t={jest.fn()} />);
  const initialValues = component
    .find("ReduxForm")
    .map(form => form.prop("initialValues"));
  expect(initialValues).toHaveLength(1);
  expect(initialValues[0]).toEqual({ username: "", password: "" });
});
