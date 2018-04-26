import React from "react";
import { shallow } from "enzyme";
import { RoleCreateForm } from "./RoleCreateForm";

it("renders without crashing", () => {
  shallow(
    <RoleCreateForm
      t={jest.fn()}
      classes={{}}
      theme={{}}
      multi={{}}
      initialValues={{}}
      options={{}}
      handleChangeMulti={jest.fn}
      onSubmit={jest.fn}
      id={{}}
    />
  );
});
