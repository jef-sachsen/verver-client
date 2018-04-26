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
import Paper from "material-ui/Paper";
import IconButton from "material-ui/IconButton";
import FirstPageIcon from "material-ui-icons/FirstPage";
import KeyboardArrowLeft from "material-ui-icons/KeyboardArrowLeft";
import KeyboardArrowRight from "material-ui-icons/KeyboardArrowRight";
import LastPageIcon from "material-ui-icons/LastPage";
import Screen from "./Screen";
import { getGroupById, getGroups, getUsers } from "../redux/selectors";
import { fetchDeleteById, fetchList } from "../redux/actions";
import { entity } from "../lib/entity";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import CreateIcon from "material-ui-icons/Create";
import DeleteIcon from "material-ui-icons/Delete";
import Typography from "material-ui/Typography";
import { getContacts } from "../redux/selectors/contactsSelectors";

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

class GroupList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleDelete = this.handleDelete.bind(this);

    this.state = {
      page: 0,
      rowsPerPage: 5
    };
  }

  componentWillMount = () => {
    const { fetchGroups, fetchUsers, fetchContacts } = this.props;
    fetchGroups();
    fetchUsers();
    fetchContacts();
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleDelete = id => {
    const { fetchDeleteGroup, fetchGroups } = this.props;
    fetchDeleteGroup(id);
    fetchGroups();
  };

  render() {
    const { classes, groups, t, users, contacts } = this.props;
    const { rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage -
      Math.min(rowsPerPage, Object.keys(groups).length - page * rowsPerPage);

    const newGroups = groups.map(group =>
      Object.assign({}, group, {
        users: !!group.users
          ? users.filter(u => group.users.includes(u.id))
          : [],
        contacts: !!group.contacts
          ? contacts.filter(contact => group.contacts.includes(contact.id))
          : [],
        responsibles: !!group.responsibles
          ? contacts.filter(resp => group.responsibles.includes(resp.id))
          : []
      })
    );

    return (
      <Screen>
        <Typography type="headline" component="h2" align="center">
          {t("group_list.header")}
        </Typography>
        <Paper className={classes.root}>
          <div className={classes.tableWrapper}>
            <Table className={classes.table} align="center">
              <TableHead>
                <TableRow>
                  <TableCell>{t("group_list.name")}</TableCell>
                  <TableCell>{t("group_list.permission")}</TableCell>
                  <TableCell style={{ width: 250 }}>
                    {t("group_list.users")}
                  </TableCell>
                  <TableCell style={{ width: 250 }}>
                    {t("group_list.contacts")}
                  </TableCell>
                  <TableCell style={{ width: 250 }}>
                    {t("group_list.responsibles")}
                  </TableCell>
                  <TableCell>{t("group_list.edit")}</TableCell>
                  <TableCell>{t("group_list.delete")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {newGroups
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(group => {
                    return (
                      <TableRow key={group.id}>
                        <TableCell>{group.name}</TableCell>
                        <TableCell>{group.permission}</TableCell>
                        <TableCell>
                          {group.users ? (
                            <div>
                              {group.users.map(user => {
                                return <p key={user.id}>{user.username}</p>;
                              })}
                            </div>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          {group.contacts ? (
                            <div>
                              {group.contacts.map(contact => {
                                return (
                                  <p key={contact.id}>{`${contact.lastName}, ${
                                    contact.firstName
                                  }`}</p>
                                );
                              })}
                            </div>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          {group.responsibles ? (
                            <div>
                              {group.responsibles.map(responsibility => {
                                return (
                                  <p key={responsibility.id}>{`${
                                    responsibility.lastName
                                  }, ${responsibility.firstName}`}</p>
                                );
                              })}
                            </div>
                          ) : null}
                        </TableCell>
                        <TableCell>
                          <Link to={`/group/edit/${group.id}`}>
                            <CreateIcon />
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() => this.handleDelete(group.id)}
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
                    count={Object.keys(groups).length}
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
        </Paper>
      </Screen>
    );
  }
}

const mapStateToProps = state => {
  return {
    groups: getGroups(state),
    users: getUsers(state),
    contacts: getContacts(state),
    group: id => getGroupById(id)(state)
  };
};

const mapDispatchToProps = {
  fetchGroups: fetchList(entity.group),
  fetchUsers: fetchList(entity.user),
  fetchContacts: fetchList(entity.contact),
  fetchDeleteGroup: fetchDeleteById(entity.group)
};

GroupList.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export const ConnectedGroupList = connect(mapStateToProps, mapDispatchToProps)(
  GroupList
);

export default withStyles(styles)(translate()(ConnectedGroupList));
