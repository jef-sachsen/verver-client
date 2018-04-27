import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withStyles } from "material-ui/styles";
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow,
  TableHead
} from "material-ui/Table";
import { Card, CardContent, Typography } from "material-ui";
import IconButton from "material-ui/IconButton";
import FirstPageIcon from "material-ui-icons/FirstPage";
import KeyboardArrowLeft from "material-ui-icons/KeyboardArrowLeft";
import KeyboardArrowRight from "material-ui-icons/KeyboardArrowRight";
import LastPageIcon from "material-ui-icons/LastPage";
import Screen from "./Screen";
import {
  getPermissions,
  getUsers,
  getRoleById,
  getRoles,
  getTimeFetchedPermissions,
  getTimeFetchedUserList
} from "../redux/selectors";
import { fetchDeleteById, fetchList } from "../redux/actions";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import CreateIcon from "material-ui-icons/Create";
import DeleteIcon from "material-ui-icons/Delete";
import { entity } from "../lib/entity";
import { CircularProgress } from "material-ui";

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
    );
  };

  //TODO FIX ADD ROLE
  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, {
  withTheme: true
})(TablePaginationActions);

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
    padding: "24px",
    "flex-grow": "1",
    "background-color": "#fafafa"
  },
  table: {
    minWidth: "20%",
    maxWidth: "90%"
  },
  tableWrapper: {
    overflowX: "auto",
    padding: "24px",
    "flex-grow": "1",
    "background-color": "#fafafa"
  }
});

class RoleList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleDelete = this.handleDelete.bind(this);

    this.state = {
      page: 0,
      rowsPerPage: 5
    };
  }

  componentWillMount = () => {
    const { fetchRoles, fetchPermissions, fetchUsers } = this.props;
    fetchRoles();
    fetchPermissions();
    fetchUsers();
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleDelete = id => {
    const { fetchDeleteRole, fetchRoles } = this.props;
    fetchDeleteRole(id);
    fetchRoles();
  };

  render() {
    const { classes, roles, permissions, users, t, isLoading } = this.props;
    const { rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage -
      Math.min(rowsPerPage, (roles || []).length - page * rowsPerPage);

    const newRoles = roles.map(role =>
      Object.assign({}, role, {
        users: !!role.users ? users.filter(u => role.users.includes(u.id)) : [],
        permissions: !!role.permissions
          ? permissions.filter(p => role.permissions.includes(p.id))
          : []
      })
    );

    const loadingScreen = (
      <Screen>
        <div className={classes.progressContainer}>
          <CircularProgress className={classes.progress} />
        </div>
      </Screen>
    );

    if (isLoading) {
      return loadingScreen;
    }

    return (
      <Screen>
        <Card className={classes.root}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary">
              {t(`role.listScreen.title`)}
            </Typography>
            <Typography variant="headline" component="h2">
              {t(`role.listScreen.headline`)}
            </Typography>
          </CardContent>
          <div className={classes.tableWrapper}>
            <Table className={classes.table} align="center">
              <TableHead>
                <TableRow>
                  <TableCell>{t("role_list.name")}</TableCell>
                  <TableCell style={{ width: 250 }}>
                    {t("role_list.permissions")}
                  </TableCell>
                  <TableCell style={{ width: 250 }}>
                    {t("role_list.users")}
                  </TableCell>
                  <TableCell>{t("role_list.edit")}</TableCell>
                  <TableCell>{t("role_list.delete")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(newRoles || [])
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(role => {
                    return (
                      <TableRow key={role.id}>
                        <TableCell>{role.name}</TableCell>
                        <TableCell>
                          {role.permissions ? (
                            <div>
                              {role.permissions.map(permission => {
                                return (
                                  <p key={permission.id}>{permission.name}</p>
                                );
                              })}
                            </div>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          {role.users ? (
                            <div>
                              {role.users.map(user => {
                                return <p key={user.id}>{user.username}</p>;
                              })}
                            </div>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          <Link to={`/role/edit/${role.id}`}>
                            <CreateIcon />
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => this.handleDelete(role.id)}
                          >
                            <DeleteIcon />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 48 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={3}
                    count={(roles || []).length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    Actions={TablePaginationActionsWrapped}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </Card>
      </Screen>
    );
  }
}

const mapStateToProps = state => {
  const timeFetchedPermissions = getTimeFetchedPermissions(state);
  const timeFetchedUserList = getTimeFetchedUserList(state);
  return {
    roles: getRoles(state),
    role: id => getRoleById(id)(state),
    permissions: getPermissions(state),
    users: getUsers(state),
    timeFetchedPermissions,
    timeFetchedUserList,
    isLoading:
      !getRoles(state) || !timeFetchedPermissions || !timeFetchedUserList
  };
};

const mapDispatchToProps = {
  fetchRoles: fetchList(entity.role),
  fetchPermissions: fetchList(entity.permission),
  fetchUsers: fetchList(entity.user),
  fetchDeleteRole: fetchDeleteById(entity.role)
};

RoleList.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export const ConnectedRoleList = connect(mapStateToProps, mapDispatchToProps)(
  RoleList
);

export default withStyles(styles)(translate()(ConnectedRoleList));
