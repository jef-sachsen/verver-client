import React from "react";
import PropTypes from "prop-types";
import { TextField, withStyles } from "material-ui";
import { Field } from "redux-form";
import i18n from "../../i18n";

export const formValidations = {
  email: value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
      ? i18n.t("validation.invalid_email_address")
      : undefined,
  required: value => (value ? undefined : i18n.t("validation.required")),
  phone: value =>
    value && !/^[0-9\- +]{4,15}$/i.test(value)
      ? i18n.t("validation.invalid_phone_number")
      : undefined
};

const styles = theme => ({
  formItem: {
    margin: theme.spacing.unit,
    width: "100%"
  }
});

const renderTextField = ({
  meta: { touched, error },
  input: { value, ...inputRest },
  ...rest
}) => (
  <TextField
    {...rest}
    {...inputRest}
    value={value ? value : ""}
    error={!!(touched && error)}
    helperText={touched && error}
  />
);

const FormTextFieldBase = ({ label, name, classNames, classes, ...rest }) => (
  <Field
    label={label ? label : name}
    name={name}
    component={renderTextField}
    className={classNames ? classNames : classes.formItem}
    {...rest}
  />
);

FormTextFieldBase.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

export const FormTextField = withStyles(styles)(FormTextFieldBase);
