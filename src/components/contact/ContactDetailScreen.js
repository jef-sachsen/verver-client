import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import {
  withStyles,
  Card,
  CardContent,
  Typography,
  CircularProgress
} from "material-ui";
import PropTypes from "prop-types";
import { initialize } from "redux-form";
import { get } from "lodash";
import { goBack } from "react-router-redux";

import {
  getContactById,
  getEntityItems,
  getContactFormValues,
  getIsFetching
} from "../../redux/selectors";
import { entity } from "../../lib/entity";
import { detailScreenType, apiMethod } from "../../config";

import Screen from "../Screen";
import ContactForm from "./ContactForm";
import {
  fetchUpdateByObject,
  fetchCreateByObject,
  fetchDetailById,
  fetchAll
} from "../../redux/actions";

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
    padding: theme.spacing.unit * 2
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

export class DetailScreen extends Component {
  state = {
    multiGroups: []
  };

  componentWillMount = () => {
    const { fetchAllGroups } = this.props;
    this.fetchContact();
    fetchAllGroups();
  };

  fetchContact = () => {
    const { fetchContactDetailById, type, id } = this.props;
    if (type === detailScreenType.edit || type === detailScreenType.view) {
      if (!!id || id === 0) {
        fetchContactDetailById(id);
      }
    }
  };

  //TODO: fix the React Select and make it a proper redux forms field
  handleChangeMultiGroups = multiGroups => {
    this.setState({
      multiGroups: !!multiGroups
        ? multiGroups.split(",").map(v => parseInt(v, 10))
        : []
    });
  };

  componentWillReceiveProps = nextProps => {
    const { contact } = this.props;
    if (contact !== nextProps.contact && nextProps.contact) {
      this.setState({
        multiGroups: nextProps.contact.groups
      });
    }
  };

  handleSubmit = values => {
    const { multiGroups } = this.state;
    const { type, fetchUpdateByObject, fetchCreateByObject } = this.props;

    if (type === detailScreenType.edit) {
      fetchUpdateByObject({
        ...values,
        groups: multiGroups
      });
      return true;
    }
    if (type === detailScreenType.create) {
      fetchCreateByObject({
        ...values,
        groups: multiGroups
      });
      return true;
    }
    return false;
  };

  handleCancel = () => {
    const { goBack } = this.props;
    goBack();
    return true;
  };

  render = () => {
    const { multiGroups } = this.state;
    console.log(multiGroups);
    const { classes, t, contact, name, type, groups, isLoading } = this.props;
    const optionsGroups = (groups || []).map(group => ({
      value: group.id,
      label: group.name
    }));
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
        <div>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary">
                {t(`contact.detailScreen.title.${type}`)}
              </Typography>
              <Typography variant="headline" component="h2">
                {t(`contact.detailScreen.headline.${type}`, { name })}
              </Typography>
            </CardContent>
            <ContactForm
              initialValues={contact}
              initialize={initialize}
              enableReinitialize={true}
              onSubmit={this.handleSubmit}
              onCancel={this.handleCancel}
              optionsGroups={optionsGroups}
              multiGroups={multiGroups}
              handleChangeMultiGroups={this.handleChangeMultiGroups}
            />
          </Card>
        </div>
      </Screen>
    );
  };
}

const mapStateToProps = (state, ownProps) => {
  const id = get(ownProps, "match.params.id");
  const type = get(ownProps, "match.params.type") || "create";
  const contact = getContactById(id)(state);
  const groups = getEntityItems(entity.group)(state);

  const isFetchingContact = getIsFetching(apiMethod.detail)(entity.contact)(
    state
  );
  const isFetchingGroups = getIsFetching(apiMethod.all)(entity.group)(state);

  const values = getContactFormValues(state);

  return {
    isLoading: isFetchingContact || isFetchingGroups,
    id,
    type,
    contact,
    groups,
    values,
    name:
      contact &&
      contact.firstName &&
      contact.lastName &&
      `${contact.firstName} ${contact.lastName}`
  };
};

const mapDispatchToProps = {
  initialize,
  goBack,
  fetchCreateByObject: fetchCreateByObject(entity.contact),
  fetchUpdateByObject: fetchUpdateByObject(entity.contact),
  fetchContactDetailById: fetchDetailById(entity.contact),
  fetchAllGroups: fetchAll(entity.group)
};

DetailScreen.propTypes = {
  t: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  initialize: PropTypes.func.isRequired
};

export const ConnectedDetailScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailScreen);

export default withStyles(styles)(translate()(ConnectedDetailScreen));
