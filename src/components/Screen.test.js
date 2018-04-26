import React from "react";
import { shallow } from "enzyme";
import { Screen, DrawerItem, DrawerListBase } from "./Screen";
import CreateIcon from "material-ui-icons/Create";
import AddIcon from "material-ui-icons/Add";
import ListIcon from "material-ui-icons/List";
import { ListItem, ListItemText, ListItemIcon } from "material-ui";

it("renders without crashing", () => {
  shallow(<Screen t={jest.fn()} classes={{}} theme={{}} />);
});

it("renders an AppBar", () => {
  const component = shallow(<Screen t={jest.fn()} classes={{}} theme={{}} />);
  const Appbar = component.find("WithStyles(AppBar)");
  expect(Appbar).toHaveLength(1);
});

it("renders a useful Drawer with DrawerLists", () => {
  const component = shallow(<Screen t={jest.fn()} classes={{}} theme={{}} />);
  const Drawer = component.find("WithStyles(Drawer)");
  expect(Drawer).toHaveLength(1);
  const DrawerLists = component.find("Translate(WithStyles(DrawerListBase))");
  expect(DrawerLists.length).toBeGreaterThan(1);
  const items = DrawerLists.map(list => list.prop("items"));
  items.forEach(item =>
    item.forEach(item => {
      expect(item).toHaveProperty("icon");
      expect(item).toHaveProperty("label");
      expect(item).toHaveProperty("link");
    })
  );
});

it("renders a DrawerItem without crashing", () => {
  shallow(<DrawerItem classes={{}} />);
});

it("DrawerItem renders a ListItem", () => {
  const component = shallow(<DrawerItem classes={{}} />);
  const ListItemText = component.find("WithStyles(ListItemText)");
  expect(ListItemText).toHaveLength(1);
});

it("DrawerItem renders a ListItem with icon and without labels if drawer is closed", () => {
  const component = shallow(
    <DrawerItem icon={AddIcon} classes={{}} open={false} />
  );
  const ListItemText = component.find("WithStyles(ListItemText)");
  const ListItemIcon = component.find("WithStyles(ListItemIcon)");
  expect(ListItemText).toHaveLength(0);
  expect(ListItemIcon).toHaveLength(1);
});

it("DrawerItem renders a ListItem with icon and labels if drawer is open", () => {
  const component = shallow(
    <DrawerItem icon={AddIcon} classes={{}} open={true} />
  );
  const ListItemText = component.find("WithStyles(ListItemText)");
  const ListItemIcon = component.find("WithStyles(ListItemIcon)");
  expect(ListItemText).toHaveLength(1);
  expect(ListItemIcon).toHaveLength(1);
});

it("renders a DrawerListBase without crashing", () => {
  shallow(<DrawerListBase t={jest.fn()} classes={{}} theme={{}} />);
});

const userSection = [
  { link: "/user/list", label: "navigation.list", icon: <ListIcon /> },
  { link: "/user/create", label: "navigation.create", icon: <AddIcon /> },
  { link: "/user/edit", label: "navigation.edit", icon: <CreateIcon /> }
];

it("renders correct Links in the DrawerList", () => {
  const component = shallow(
    <DrawerListBase
      t={jest.fn()}
      classes={{}}
      theme={{}}
      header={{ label: "navigation.header.user" }}
      items={userSection}
    />
  );
  const Links = component.find("Link");
  expect(Links).toHaveLength(3);
  const paths = Links.map(link => link.prop("to"));
  expect(paths).toContain("/user/list");
  expect(paths).toContain("/user/create");
  expect(paths).toContain("/user/edit");
});
