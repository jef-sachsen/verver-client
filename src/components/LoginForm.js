import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { TextField, Button } from "material-ui";
import { Field, reduxForm } from "redux-form";
import { translate } from "react-i18next";

const styles = theme => ({
  loginForm: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  formItem: {
    margin: theme.spacing.unit
  },
  formColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start"
  },
  formRow: {
    display: "flex",
    flexDirection: "row"
  }
});

const renderTextField = ({ input, meta: { touched, error }, ...rest }) => (
  <TextField {...rest} {...input} error={touched && error} />
);

export class LoginForm extends Component {
  render() {
    const { handleSubmit, canSubmit, classes, t } = this.props;
    return (
      <form onSubmit={handleSubmit} className={classes.loginForm}>
        <div className={classes.formRow}>
          <Field
            label={t("login.label_username")}
            name="username"
            component={renderTextField}
            className={classes.formItem}
          />
        </div>
        <div className={classes.formRow}>
          <Field
            label={t("login.label_password")}
            name="password"
            type="password"
            component={renderTextField}
            className={classes.formItem}
          />
        </div>
        <div className={classes.formRow}>
          <Button
            raised
            color="primary"
            type="submit"
            disabled={!canSubmit}
            className={classes.formItem}
          >
            {t("login.button_login")}
          </Button>
        </div>
      </form>
    );
  }
}

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default reduxForm({ form: "login" })(
  withStyles(styles)(translate()(LoginForm))
);
