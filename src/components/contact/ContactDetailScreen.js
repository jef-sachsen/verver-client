import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { withStyles, Card, CardContent, Typography } from "material-ui";
import PropTypes from "prop-types";
import { initialize } from "redux-form";
import { get } from "lodash";
import { goBack } from "react-router-redux";

import {
  getContactById,
  getEntityItems,
  getContactFormValues
} from "../../redux/selectors";
import { entity } from "../../lib/entity";
import { detailScreenType } from "../../config";

import Screen from "../Screen";
import ContactForm from "./ContactForm";
import { fetchUpdateByObject, fetchCreateByObject } from "../../redux/actions";

const styles = theme => ({
  card: {
    minWidth: 275
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
  handleSubmit = values => {
    const { type, fetchUpdateByObject, fetchCreateByObject } = this.props;

    if (type === detailScreenType.edit) {
      fetchUpdateByObject(values);
      return true;
    }
    if (type === detailScreenType.create) {
      fetchCreateByObject(values);
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
    const { classes, t, contact, name, type } = this.props;
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
            />
          </Card>
        </div>
      </Screen>
    );
  };
}

const mapStateToProps = (state, ownProps) => {
  const id = get(ownProps, "match.params.id");
  const type = get(ownProps, "match.params.type");
  const contact = getContactById(id)(state);
  const groups = getEntityItems(entity.group)(state);

  const values = getContactFormValues(state);

  return {
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
  fetchUpdateByObject: fetchUpdateByObject(entity.contact)
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
