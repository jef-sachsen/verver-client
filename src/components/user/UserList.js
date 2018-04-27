import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Table, {
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow
} from "material-ui/Table";
import IconButton from "material-ui/IconButton";
import FirstPageIcon from "material-ui-icons/FirstPage";
import KeyboardArrowLeft from "material-ui-icons/KeyboardArrowLeft";
import KeyboardArrowRight from "material-ui-icons/KeyboardArrowRight";
import LastPageIcon from "material-ui-icons/LastPage";
import CreateIcon from "material-ui-icons/Create";

import { connect } from "react-redux";
import { translate } from "react-i18next";
import { Link } from "react-router-dom";

import { CircularProgress, Card, CardContent, Typography } from "material-ui";

import { apiMethod } from "../../config";
import { entity } from "../../lib/entity";
import {
  getMeta,
  getItems,
  getIsFetching,
  getTimeFetched
} from "../../redux/selectors";
import { fetchList } from "../../redux/actions";

import Screen from "../Screen";

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
    this.props.onChangePage(event, this.props.totalPages - 1);
  };

  render() {
    const { classes, page, theme, meta } = this.props;

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
          disabled={!meta.hasNext}
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
          disabled={page === meta.totalPages - 1}
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

const ConnectedTablePaginationActionsWrapped = connect(
  state => ({ meta: getMeta(apiMethod.list)(entity.user)(state) }),
  null
)(TablePaginationActionsWrapped);

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2
  },
  progressContainer: {
    width: "100%",
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  card: {
    height: "100%",
    width: "100%",
    padding: theme.spacing.unit * 2
  },
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 500
  },
  wrapper: {
    flexGrow: 1,
    display: "flex",
    width: "100%"
  },
  tableWrapper: {
    overflowX: "auto"
  }
});

class UserList extends React.Component {
  componentWillMount = () => {
    const { fetchUserList, meta } = this.props;
    const { page = 0, size = 10 } = meta || {};
    fetchUserList({ page, size });
  };

  handleChangePage = (event, page) => {
    const { fetchUserList, meta = {} } = this.props;
    fetchUserList({ page, size: meta.size });
  };

  handleChangeSize = event => {
    const { fetchUserList, meta = {} } = this.props;
    fetchUserList({ page: meta.page, size: event.target.value });
  };

  render() {
    const { classes, isLoading, users, meta = {}, t } = this.props;
    const emptyRows = 0;

    if (isLoading) {
      return (
        <Screen>
          <div className={classes.progressContainer}>
            <CircularProgress className={classes.progress} />
          </div>
        </Screen>
      );
    }

    return (
      <Screen>
        <div className={classes.wrapper}>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary">
                {t(`user.listScreen.title`)}
              </Typography>
              <Typography variant="headline" component="h2">
                {t(`user.listScreen.headline`)}
              </Typography>
            </CardContent>
            <CardContent>
              <div className={classes.tableWrapper}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("user.label.id")}</TableCell>
                      <TableCell>{t("user.label.username")}</TableCell>
                      <TableCell>{t("user.label.edit")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map(user => {
                      return (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>
                            <Link to={`/user/edit/${user.id}`}>
                              <CreateIcon />
                            </Link>
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
                        count={meta.totalElements}
                        rowsPerPage={meta.size}
                        page={meta.page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeSize}
                        Actions={ConnectedTablePaginationActionsWrapped}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </Screen>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const users = getItems(apiMethod.list)(entity.user)(state);
  const meta = getMeta(apiMethod.list)(entity.user)(state);
  const isFetchingUsers = getIsFetching(apiMethod.list)(entity.user)(state);
  const timeFetchedUsers = getTimeFetched(apiMethod.list)(entity.user)(state);

  return {
    isLoading: !timeFetchedUsers || isFetchingUsers,
    isLoaded: !!timeFetchedUsers,
    users,
    meta
  };
};

const mapDispatchToProps = {
  fetchUserList: fetchList(entity.user)
};

UserList.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

const ConnectedUserList = connect(mapStateToProps, mapDispatchToProps)(
  UserList
);

export default translate()(withStyles(styles)(ConnectedUserList));
