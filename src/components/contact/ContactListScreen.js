import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination
} from "material-ui/Table";
import { connect } from "react-redux";
import { fetchList } from "../../redux/actions";
import { getItems, getItemById } from "../../redux/selectors";
import IconButton from "material-ui/IconButton";
import KeyboardArrowLeft from "material-ui-icons/KeyboardArrowLeft";
import KeyboardArrowRight from "material-ui-icons/KeyboardArrowRight";
import Screen from "../Screen";
import { entity } from "../../lib/entity";
import { apiMethod } from "../../config";

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
});

class TablePaginationActions extends React.Component {
  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
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
    overflowX: "auto"
  },
  table: {
    minWidth: "20%",
    maxWidth: "90%"
  },
  tableWrapper: {
    overflowX: "auto"
  }
});

class ContactList extends Component {
  componentWillMount = () => {
    const { fetchContacts } = this.props;
    fetchContacts();
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      page: 0,
      rowsPerPage: 5
    };
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const { classes, users } = this.props;
    const { rowsPerPage, page } = this.state;

    //console.log("Render a component", users, this.props.user(6));
    return (
      <Screen>
        <h2 align="center">Übersicht aller Mitglieder</h2>
        {users ? (
          <div>
            <Table className={classes.table} align="center">
              <TableHead>
                <TableRow>
                  <TableCell numeric>Mitgliedsnummer</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell style={{ width: 250 }}>Rollen</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(user => {
                    return (
                      <TableRow key={user.id}>
                        <TableCell numeric>{user.id}</TableCell>
                        <TableCell>
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.roles ? (
                            <div>
                              {user.roles.map(role => {
                                return <p key={role.id}>{role.name}</p>;
                              })}
                            </div>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={3}
                    count={users.length}
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
        ) : (
          <div align="center">Es existieren keine Mitglieder!</div>
        )}
      </Screen>
    );
  }
}

ContactList.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    contacts: getItems(apiMethod.list)(entity.contact)(state),
    getContactById: id => getItemById(entity.contact)(id)(state)
  };
};

const mapDispatchToProps = {
  fetchContacts: fetchList(entity.contact)
};

export const ConnectedContactList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactList);

export default withStyles(styles)(ConnectedContactList);
