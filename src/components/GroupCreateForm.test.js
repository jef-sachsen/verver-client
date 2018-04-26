import React from "react";
import { shallow } from "enzyme";
import { GroupCreateForm } from "./GroupCreateForm";

it("renders without crashing", () => {
  shallow(
    <GroupCreateForm
      t={jest.fn()}
      classes={{}}
      theme={{}}
      multi={{}}
      initialValues={{}}
      options={{}}
      handleChangeMulti={jest.fn}
      handleChangeSingle={jest.fn}
      handleChange={jest.fn}
      onSubmit={jest.fn}
      id={{}}
    />
  );
});
