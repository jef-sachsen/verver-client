import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { withStyles } from "material-ui/styles";
import Typography from "material-ui/Typography";
import Paper from "material-ui/Paper";
import { Field, reduxForm } from "redux-form";
import { TextField, Button } from "material-ui";
import "react-select/dist/react-select.css";
import ReactSelect from "./ReactSelect";
import { translate } from "react-i18next";

const styles = theme => ({
  chip: {
    margin: theme.spacing.unit / 4
  },
  root: theme.mixins.gutters({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 16,
    margin: `${theme.spacing.unit * 3}px auto 0`,
    width: 700
  }),
  formColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start"
  },
  formRow: {
    display: "flex",
    flexDirection: "row"
  },
  formItem: {
    margin: theme.spacing.unit,
    width: 700
  },
  buttonsRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: 25
  },
  buttonRow: {
    display: "flex",
    flexDirection: "row",
    margin: 5
  },
  cancelButton: {
    "text-decoration": "none"
  }
});

const renderTextField = ({ input, meta: { touched, error }, ...rest }) => (
  <TextField {...rest} {...input} error={touched && error} />
);

export class RoleCreateForm extends React.Component {
  render() {
    const {
      classes,
      optionsPermissions,
      optionsUsers,
      handleDelete,
      handleSubmit,
      handleChangeMultiPermissions,
      multiPermissions,
      handleChangeMultiUsers,
      multiUsers,
      initialValues,
      canSubmit,
      id,
      t
    } = this.props;

    return (
      <form onSubmit={handleSubmit} className={classes.userCreateForm}>
        <Paper className={classes.root} elevation={4}>
          <Typography type="headline" component="h2">
            {!!id || id === 0
              ? t("role.edit_role_header")
              : t("role.create_role_header")}
          </Typography>
          <div className={classes.formRow}>
            <Field
              label={t("role.role_name")}
              name="name"
              initialValues={initialValues.name}
              component={renderTextField}
              className={classes.formItem}
            />
          </div>
          <div className={classes.formRow}>
            <div className={classes.formItem}>
              <ReactSelect
                className={classes.formItem}
                name={"selectPermissions"}
                options={optionsPermissions}
                handleChangeMulti={handleChangeMultiPermissions}
                multi={multiPermissions}
                canAddMultipleValues={true}
                placeholder={t("role.select_permissions")}
              />
            </div>
          </div>
          <div className={classes.formRow}>
            <div className={classes.formItem}>
              <ReactSelect
                className={classes.formItem}
                name={"selectUsers"}
                options={optionsUsers}
                handleChangeMulti={handleChangeMultiUsers}
                multi={multiUsers}
                canAddMultipleValues={true}
                placeholder={t("role.select_users")}
              />
            </div>
          </div>

          <div className={classes.buttonsRow}>
            <div className={classes.buttonRow}>
              <Link className={classes.cancelButton} to="/role/list">
                <Button color="primary">{t("role.cancel")}</Button>
              </Link>
            </div>
            {!!id || id === 0 ? (
              <div className={classes.buttonRow}>
                <Button onClick={handleDelete} color="primary">
                  {t("role.delete")}
                </Button>
              </div>
            ) : null}
            <div className={classes.buttonRow}>
              <Button color="primary" type="submit" disabled={!canSubmit}>
                {!!id || id === 0 ? t("role.save_role") : t("role.add_role")}
              </Button>
            </div>
          </div>
        </Paper>
      </form>
    );
  }
}

RoleCreateForm.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default reduxForm({ form: "RoleCreateForm", enableReinitialize: true })(
  withStyles(styles)(translate()(RoleCreateForm))
);
