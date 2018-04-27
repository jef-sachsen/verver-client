import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { Button, CardContent, CardActions, Grid } from "material-ui";
import { reduxForm, Form } from "redux-form";
import { translate } from "react-i18next";

import { FormTextField, formValidations } from "../layout/FormFields";

const styles = theme => ({
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexGrow: 1
  },
  actions: {
    width: "100%"
  }
});

export class ContactForm extends Component {
  render() {
    const {
      handleSubmit,
      onCancel,
      pristine,
      invalid,
      submitting,
      asyncValidating,
      classes,
      t
    } = this.props;
    console.log(this.props);
    const canSubmit = !(
      pristine ||
      submitting ||
      invalid ||
      asyncValidating === true
    );
    return (
      <Form onSubmit={handleSubmit} className={classes.form}>
        <CardContent>
          <Grid container spacing={24}>
            <Grid item xs={12} md={6}>
              <FormTextField
                label={t("contact.label.email")}
                name="email"
                validate={[formValidations.required, formValidations.email]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label={t("contact.label.firstname")}
                name="firstName"
                validate={[formValidations.required]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label={t("contact.label.lastname")}
                name="lastName"
                validate={[formValidations.required]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label={t("contact.label.phone")}
                name="phone"
                validate={[formValidations.phone]}
              />
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
        <CardActions className={classes.actions}>
          <Grid
            container
            spacing={24}
            alignItems={"flex-end"}
            justify={"flex-end"}
          >
            <Grid item>
              <Button color="primary" size="large" onClick={onCancel}>
                {t("cancel")}
              </Button>
              <Button
                color="primary"
                type="submit"
                disabled={!canSubmit}
                size="large"
              >
                {t("contact.detailScreen.saveButtonLabel")}
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Form>
    );
  }
}

ContactForm.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool
};

export default reduxForm({ form: "contact" })(
  withStyles(styles)(translate()(ContactForm))
);
