import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
  withStyles,
  Drawer,
  IconButton,
  Divider,
  AppBar,
  List,
  ListItem,
  ListSubheader,
  ListItemIcon,
  ListItemText
} from "material-ui";
import ChevronLeftIcon from "material-ui-icons/ChevronLeft";
import ChevronRightIcon from "material-ui-icons/ChevronRight";
import AddIcon from "material-ui-icons/Add";
import ListIcon from "material-ui-icons/List";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { openDrawer, closeDrawer } from "../redux/actions";
import { isDrawerOpen } from "../redux/selectors";
import { translate } from "react-i18next";
import Toolbar from "./Toolbar";

const styles = theme => {
  const { custom: { drawer } } = theme;
  const drawerWidth = drawer.width;
  const closedDrawerWidth = drawer.closedWidth;
  return {
    root: {
      flexGrow: 1,
      minHeight: "100vh",
      zIndex: 1,
      overflow: "hidden",
      position: "relative",
      display: "flex"
    },
    appBar: {
      position: "fixed",
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    menuButton: {
      marginLeft: 12,
      marginRight: 36
    },
    hide: {
      display: "none"
    },
    drawerPaper: {
      position: "fixed",
      backgroundColor: "white",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    drawerPaperClose: {
      position: "fixed",
      backgroundColor: "white",
      width: closedDrawerWidth,
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    fullWidth: {
      width: "100%",
      marginRight: 0,
      marginLeft: 0,
      alignSelf: "center"
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 8px",
      ...theme.mixins.toolbar
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing.unit * 3
    },
    noTextDecoration: {
      textDecoration: "none"
    }
  };
};

export const DrawerItem = ({
  icon = null,
  label = "",
  open = true,
  classes
}) => (
  <ListItem button>
    {icon ? (
      <ListItemIcon className={open ? undefined : classes.fullWidth}>
        {icon}
      </ListItemIcon>
    ) : null}
    {open ? <ListItemText primary={label} /> : null}
  </ListItem>
);

DrawerItem.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool
};

export const DrawerListBase = props => {
  const { translate = true, header, items = [], t, classes, open } = props;
  return (
    <List>
      {header ? (
        <ListSubheader>
          {translate ? t(header.label) : header.label}
        </ListSubheader>
      ) : null}
      {items.map((item, index) => {
        const { label, link, ...rest } = item;
        return (
          <Link className={classes.noTextDecoration} key={index} to={link}>
            <DrawerItem
              classes={classes}
              open={open}
              label={translate ? t(label) : label}
              {...rest}
            />
          </Link>
        );
      })}
    </List>
  );
};

DrawerListBase.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  translate: PropTypes.bool,
  header: PropTypes.object,
  items: PropTypes.array,
  open: PropTypes.bool
};

const DrawerList = translate()(withStyles(styles)(DrawerListBase));

const contactSection = [
  { link: "/contact/list", label: "navigation.list", icon: <ListIcon /> },
  { link: "/contact/create", label: "navigation.create", icon: <AddIcon /> }
];
const userSection = [
  { link: "/user/list", label: "navigation.list", icon: <ListIcon /> },
  { link: "/user/create", label: "navigation.create", icon: <AddIcon /> }
];
const roleSection = [
  { link: "/role/list", label: "navigation.list", icon: <ListIcon /> },
  { link: "/role/create", label: "navigation.create", icon: <AddIcon /> }
];
const groupSection = [
  { link: "/group/list", label: "navigation.list", icon: <ListIcon /> },
  { link: "/group/create", label: "navigation.create", icon: <AddIcon /> }
];

export class Screen extends React.Component {
  render() {
    const { classes, theme, children, closeDrawer, open } = this.props;

    return (
      <div className={classes.root}>
        <AppBar
          position="absolute"
          className={classNames(classes.appBar, open && classes.appBarShift)}
        >
          <Toolbar />
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(
              classes.drawerPaper,
              !open && classes.drawerPaperClose
            )
          }}
          open={open}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={closeDrawer}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <DrawerList
            header={{ label: "navigation.header.contact" }}
            items={contactSection}
            open={open}
          />
          <DrawerList
            header={{ label: "navigation.header.user" }}
            items={userSection}
            open={open}
          />
          <DrawerList
            header={{ label: "Role" }}
            items={roleSection}
            open={open}
          />
          <DrawerList
            header={{ label: "navigation.header.group" }}
            items={groupSection}
            open={open}
          />
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {children}
        </main>
      </div>
    );
  }
}

Screen.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    open: isDrawerOpen(state)
  };
};

const mapDispatchToProps = {
  openDrawer,
  closeDrawer
};

const ConnectedScreen = connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, { withTheme: true })(translate()(Screen))
);

export default ConnectedScreen;
