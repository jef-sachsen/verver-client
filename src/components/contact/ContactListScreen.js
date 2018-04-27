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
  state => ({ meta: getMeta(apiMethod.list)(entity.contact)(state) }),
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

class ContactList extends React.Component {
  componentWillMount = () => {
    const { fetchContactList, meta } = this.props;
    const { page = 0, size = 10 } = meta || {};
    fetchContactList({ page, size });
  };

  handleChangePage = (event, page) => {
    const { fetchContactList, meta = {} } = this.props;
    fetchContactList({ page, size: meta.size });
  };

  handleChangeSize = event => {
    const { fetchContactList, meta = {} } = this.props;
    fetchContactList({ page: meta.page, size: event.target.value });
  };

  render() {
    const { classes, isLoading, contacts, meta = {}, t } = this.props;
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
                {t(`contact.listScreen.title`)}
              </Typography>
              <Typography variant="headline" component="h2">
                {t(`contact.listScreen.headline`)}
              </Typography>
            </CardContent>
            <CardContent>
              <div className={classes.tableWrapper}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("contact.label.firstname")}</TableCell>
                      <TableCell>{t("contact.label.lastname")}</TableCell>
                      <TableCell>{t("contact.label.email")}</TableCell>
                      <TableCell>{t("contact.label.phone")}</TableCell>
                      <TableCell>{t("contact.label.address")}</TableCell>
                      <TableCell>{t("contact.label.bankDetails")}</TableCell>
                      <TableCell>{t("contact.label.edit")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {contacts.map(contact => {
                      return (
                        <TableRow key={contact.id}>
                          <TableCell>{contact.firstName}</TableCell>
                          <TableCell>{contact.lastName}</TableCell>
                          <TableCell>{contact.email}</TableCell>
                          <TableCell>{contact.phone}</TableCell>
                          <TableCell>{contact.address}</TableCell>
                          <TableCell>{contact.bankDetails}</TableCell>
                          <TableCell>
                            <Link to={`/contact/${contact.id}/edit`}>
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
  const contacts = getItems(apiMethod.list)(entity.contact)(state);
  const meta = getMeta(apiMethod.list)(entity.contact)(state);
  const isFetchingContacts = getIsFetching(apiMethod.list)(entity.contact)(
    state
  );
  const timeFetchedContacts = getTimeFetched(apiMethod.list)(entity.contact)(
    state
  );

  return {
    isLoading: !timeFetchedContacts || isFetchingContacts,
    isLoaded: !!timeFetchedContacts,
    contacts,
    meta
  };
};

const mapDispatchToProps = {
  fetchContactList: fetchList(entity.contact)
};

ContactList.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

const ConnectedContactList = connect(mapStateToProps, mapDispatchToProps)(
  ContactList
);

export default translate()(withStyles(styles)(ConnectedContactList));
