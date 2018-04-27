import { Field, reduxForm } from "redux-form";
import { withStyles } from "material-ui/styles/index";
import { Link } from "react-router-dom";
import React from "react";
import PropTypes from "prop-types";
import Typography from "material-ui/Typography";
import Paper from "material-ui/Paper";
import { TextField, Button } from "material-ui";
import "react-select/dist/react-select.css";
import ReactSelect from "./ReactSelect";
import Checkbox from "./Checkbox";
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
    flexDirection: "row",
    width: "100%"
  },
  formItem: {
    margin: theme.spacing.unit,
    width: "100%"
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

export class UserCreateForm extends React.Component {
  render() {
    const {
      classes,
      handleDelete,
      handleSubmit,
      roles,
      groups,
      contacts,
      multiRoles,
      multiGroups,
      singleContact,
      handleChange,
      handleChangeSingle,
      handleChangeCheckbox,
      checkedAdmin,
      checkedEnabled,
      canSubmit,
      id,
      t,
      canDelete
    } = this.props;
    var validID = !!id || id === 0;
    return (
      <form onSubmit={handleSubmit} className={classes.userCreateForm}>
        <Paper className={classes.root} elevation={4}>
          <Typography type="headline" component="h2">
            {!!validID
              ? t("user.edit_user_header")
              : t("user.create_user_header")}
          </Typography>
          <div className={classes.formRow}>
            <Field
              label={t("user.username")}
              name="username"
              component={renderTextField}
              className={classes.formItem}
            />
          </div>
          <div className={classes.formRow}>
            <Field
              label={
                !!validID ? t("user.password_msg_edit") : t("user.password")
              }
              name="password"
              type="password"
              component={renderTextField}
              className={classes.formItem}
            />
          </div>
          <div className={classes.formRow}>
            <div className={classes.formItem}>
              <ReactSelect
                className={classes.formItem}
                name={"selectRoles"}
                options={roles}
                canAddMultipleValues={true}
                handleChangeMulti={handleChange("multiRoles")}
                multi={multiRoles}
                placeholder={t("user.roles")}
              />
            </div>
          </div>
          <div className={classes.formRow}>
            <div className={classes.formItem}>
              <ReactSelect
                className={classes.formItem}
                name={"selectGroups"}
                options={groups}
                canAddMultipleValues={true}
                handleChangeMulti={handleChange("multiGroups")}
                multi={multiGroups}
                placeholder={t("user.select_groups")}
              />
            </div>
          </div>
          <div className={classes.formRow}>
            <div className={classes.formItem}>
              <ReactSelect
                className={classes.formItem}
                name={"selectContact"}
                options={contacts}
                handleChangeMulti={handleChangeSingle("singleContact")}
                multi={singleContact}
                canAddMultipleValues={false}
                placeholder={t("user.select_one_contact")}
              />
            </div>
          </div>
          <div className={classes.formRow}>
            <div className={classes.formItem}>
              <Checkbox
                checked={checkedAdmin}
                name={"checkedAdmin"}
                disabled={!canDelete}
                onChange={canDelete ? handleChangeCheckbox : undefined}
                label={t("user.checkBoxAdmin")}
              />
            </div>
            <div className={classes.formItem}>
              <Checkbox
                checked={checkedEnabled}
                name={"checkedEnabled"}
                onChange={handleChangeCheckbox}
                label={t("user.checkBoxEnabled")}
              />
            </div>
          </div>

          <div className={classes.buttonsRow}>
            <div className={classes.buttonRow}>
              <Link className={classes.cancelButton} to="/user/list">
                <Button color="primary">{t("user.cancel")}</Button>
              </Link>
            </div>
            {!!validID && canDelete ? (
              <div className={classes.buttonRow}>
                <Button onClick={handleDelete} color="primary">
                  {t("user.delete")}
                </Button>
              </div>
            ) : null}
            <div className={classes.buttonRow}>
              <Button color="primary" type="submit" disabled={!canSubmit}>
                {!!validID ? t("user.save_user") : t("user.add_user")}
              </Button>
            </div>
          </div>
        </Paper>
      </form>
    );
  }
}

UserCreateForm.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

export default reduxForm({ form: "UserCreateForm", enableReinitialize: true })(
  withStyles(styles)(translate()(UserCreateForm))
);
