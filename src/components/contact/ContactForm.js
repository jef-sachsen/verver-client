import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import {
  TextField,
  Button,
  CardContent,
  CardActions,
  Grid,
  Paper
} from "material-ui";
import { Field, reduxForm } from "redux-form";
import { translate } from "react-i18next";

import { renderTextField, FormTextField } from "../layout/FormFields";

const styles = theme => ({
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexGrow: 1
  }
});

export class ContactForm extends Component {
  render() {
    const { handleSubmit, canSubmit, classes, t } = this.props;
    return (
      <form onSubmit={handleSubmit} className={classes.form}>
        <CardContent>
          <Grid container spacing={24}>
            <Grid item xs={12} md={6}>
              <FormTextField label={t("contact.label.email")} name="email" />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label={t("contact.label.firstname")}
                name="firstName"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label={t("contact.label.lastname")}
                name="lastName"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField label={t("contact.label.phone")} name="phone" />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label={t("contact.label.address")}
                name="address"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label={t("contact.label.bankDetails")}
                name="bankDetails"
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions className={classes.formItem}>
          <Grid
            container
            spacing={24}
            alignItems={"center"}
            justify={"flex-end"}
          >
            <Grid item xs={2}>
              <Button
                raised
                color="primary"
                type="submit"
                disabled={!canSubmit}
                size="small"
              >
                {t("detailScreen.saveButtonLabel")}
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </form>
    );
  }
}

ContactForm.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default reduxForm({ form: "contact" })(
  withStyles(styles)(translate()(ContactForm))
);
