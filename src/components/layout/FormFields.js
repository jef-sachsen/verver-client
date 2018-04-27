import React, { Component } from "react";
import PropTypes from "prop-types";
import { TextField, withStyles } from "material-ui";
import { Field } from "redux-form";

const styles = theme => ({
  formItem: {
    margin: theme.spacing.unit,
    width: "100%"
  }
});

export const renderTextField = ({
  input,
  meta: { touched, error },
  ...rest
}) => <TextField {...rest} {...input} error={touched && error} />;

const FormTextFieldBase = ({ label, name, classNames, classes }) => (
  <Field
    label={label ? label : name}
    name={name}
    component={renderTextField}
    className={classNames ? classNames : classes.formItem}
  />
);

FormTextFieldBase.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

export const FormTextField = withStyles(styles)(FormTextFieldBase);
