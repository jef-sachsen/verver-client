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

export class GroupCreateForm extends React.Component {
  render() {
    const {
      classes,
      handleDelete,
      handleSubmit,
      canSubmit,
      users,
      contacts,
      multiUsers,
      multiContacts,
      multiResponsibles,
      singlePermission,
      permissionToChoose,
      handleChange,
      handleChangeSingle,
      id,
      t
    } = this.props;
    var validID = !!id || id === 0;
    return (
      <form onSubmit={handleSubmit} className={classes.userCreateForm}>
        <Paper className={classes.root} elevation={4}>
          <Typography type="headline" component="h2">
            {!!validID
              ? t("group.edit_group_header")
              : t("group.create_group_header")}
          </Typography>
          <div className={classes.formRow}>
            <Field
              label={t("group.group_name")}
              name="name"
              component={renderTextField}
              className={classes.formItem}
            />
          </div>
          <div className={classes.formRow}>
            <div className={classes.formItem}>
              <ReactSelect
                className={classes.formItem}
                name={"selectPermission"}
                options={permissionToChoose}
                handleChangeMulti={handleChangeSingle("singlePermission")}
                multi={singlePermission}
                canAddMultipleValues={false}
                placeholder={t("group.select_one_permission")}
              />
            </div>
          </div>
          <div className={classes.formRow}>
            <div className={classes.formItem}>
              <ReactSelect
                className={classes.formItem}
                name={"selectUsers"}
                options={users}
                canAddMultipleValues={true}
                handleChangeMulti={handleChange("multiUsers")}
                multi={multiUsers}
                placeholder={t("group.select_users")}
              />
            </div>
          </div>
          <div className={classes.formRow}>
            <div className={classes.formItem}>
              <ReactSelect
                className={classes.formItem}
                name={"selectContacts"}
                options={contacts}
                canAddMultipleValues={true}
                handleChangeMulti={handleChange("multiContacts")}
                multi={multiContacts}
                placeholder={t("group.select_contacts")}
              />
            </div>
          </div>
          <div className={classes.formRow}>
            <div className={classes.formItem}>
              <ReactSelect
                className={classes.formItem}
                name={"selectResponsibles"}
                options={contacts}
                canAddMultipleValues={true}
                handleChangeMulti={handleChange("multiResponsibles")}
                multi={multiResponsibles}
                placeholder={t("group.select_responsibles")}
              />
            </div>
          </div>

          <div className={classes.buttonsRow}>
            <div className={classes.buttonRow}>
              <Link className={classes.cancelButton} to="/group/list">
                <Button color="primary">{t("group.cancel")}</Button>
              </Link>
            </div>
            {!!validID ? (
              <div className={classes.buttonRow}>
                <Button onClick={handleDelete} color="primary">
                  {t("group.delete")}
                </Button>
              </div>
            ) : null}
            <div className={classes.buttonRow}>
              <Button color="primary" type="submit" disabled={!canSubmit}>
                {!!validID ? t("group.save_group") : t("group.add_group")}
              </Button>
            </div>
          </div>
        </Paper>
      </form>
    );
  }
}

GroupCreateForm.propTypes = {
  classes: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  handleChangeSingle: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default reduxForm({ form: "GroupCreateForm", enableReinitialize: true })(
  withStyles(styles)(translate()(GroupCreateForm))
);
