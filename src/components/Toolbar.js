import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
  Menu,
  MenuItem,
  Toolbar as MuiToolbar,
  withStyles,
  IconButton,
  Typography
} from "material-ui";
import AccountCircle from "material-ui-icons/AccountCircle";
import MenuIcon from "material-ui-icons/Menu";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { openDrawer, logout } from "../redux/actions";
import { isDrawerOpen } from "../redux/selectors";
import { translate } from "react-i18next";
import { push } from "react-router-redux";

const styles = theme => {
  return {
    menuButton: {
      marginLeft: 12,
      marginRight: 36
    },
    hide: {
      display: "none"
    },
    left: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center"
    },
    guttersRight: {
      paddingRight: 24
    },
    guttersLeft: {
      paddingLeft: 24
    },
    right: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center"
    },
    toolbarContent: {
      paddingRight: 24
    },
    main: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%"
    },
    title: {
      textDecoration: "none",
      color: theme.palette.primary.contrastText
    }
  };
};

export class Toolbar extends React.Component {
  state = {
    auth: true,
    anchorEl: null
  };

  handleChange = (event, checked) => {
    this.setState({ auth: checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleProfileClick = () => {
    const { push } = this.props;
    push("/profile");
    this.handleClose();
  };

  handleLogout = () => {
    const { logout } = this.props;
    logout();
    this.handleClose();
  };

  render = () => {
    const { classes, className, openDrawer, t, open } = this.props;
    const { anchorEl } = this.state;
    const menuOpen = Boolean(anchorEl);
    return (
      <MuiToolbar
        disableGutters={true}
        className={classNames(
          classes.guttersRight,
          open && classes.guttersLeft
        )}
      >
        <div className={classes.main}>
          <div className={classes.left}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={openDrawer}
              className={classNames(
                classes.menuButton,
                open && classes.hide,
                className
              )}
            >
              <MenuIcon />
            </IconButton>
            <Link className={classes.title} to="/">
              <Typography variant="title" color="inherit" noWrap>
                {t("title")}
              </Typography>
            </Link>
          </div>
          <div className={classes.right}>
            <IconButton
              aria-owns={menuOpen ? "menu-appbar" : null}
              aria-haspopup="true"
              onClick={this.handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              open={menuOpen}
              onClose={this.handleClose}
            >
              <MenuItem onClick={this.handleProfileClick}>Profile</MenuItem>
              <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </div>
      </MuiToolbar>
    );
  };
}

Toolbar.propTypes = {
  t: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  openDrawer: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    open: isDrawerOpen(state)
  };
};

const mapDispatchToProps = {
  openDrawer,
  logout,
  push
};

const ConnnectedToolbar = connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles, { withTheme: true })(translate()(Toolbar))
);

export default ConnnectedToolbar;
