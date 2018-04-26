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
import { fetchList } from "../redux/actions";
import { getUsers as getUsersFromState, getUserById } from "../redux/selectors";
import IconButton from "material-ui/IconButton";
import KeyboardArrowLeft from "material-ui-icons/KeyboardArrowLeft";
import KeyboardArrowRight from "material-ui-icons/KeyboardArrowRight";
import Screen from "./Screen";
import { entity } from "../lib/entity";
import { Link } from "react-router-dom";
import CreateIcon from "material-ui-icons/Create";
import { translate } from "react-i18next";
import Typography from "material-ui/Typography";

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
    width: "30%"
  },
  tableWrapper: {
    overflowX: "auto"
  }
});

class UserList extends Component {
  componentWillMount = () => {
    const { fetchUsers } = this.props;
    fetchUsers();
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
    const { classes, users, t } = this.props;
    const { rowsPerPage, page } = this.state;

    //console.log("Render a component", users, this.props.user(6));
    return (
      <Screen>
        <Typography variant="title" align="center" gutterBottom>
          {t("user_list.header")}
        </Typography>
        {users ? (
          <div>
            <Table className={classes.table} align="center">
              <TableHead>
                <TableRow>
                  <TableCell>{t("user_list.name")}</TableCell>
                  <TableCell>{t("user_list.edit")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(user => {
                    return (
                      <TableRow key={user.id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>
                          <Link to={`/user/edit/${user.id}`}>
                            <CreateIcon />
                          </Link>
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
        ) : null}
      </Screen>
    );
  }
}

UserList.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    users: getUsersFromState(state),
    user: id => getUserById(id)(state)
  };
};

const mapDispatchToProps = {
  fetchUsers: fetchList(entity.user)
};

export const ConnectedUserList = connect(mapStateToProps, mapDispatchToProps)(
  UserList
);

export default withStyles(styles)(translate()(ConnectedUserList));
