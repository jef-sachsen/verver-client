import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { CircularProgress, withStyles, Snackbar } from "material-ui";

import RoleCreateForm from "./RoleCreateForm";
import {
  fetchCreateByObject,
  fetchDeleteById,
  fetchUpdateByObject,
  fetchDetailById,
  fetchAll,
  resetRoleCreateState
} from "../redux/actions";
import {
  getPermissions,
  getRoleFormValues,
  getTimeFetchedPermissions,
  isFetchingPermissions,
  isCreatingRole,
  getCreateRoleTimeFetched,
  getCreateRoleError,
  isEditedRole,
  isLoadedRole,
  getRoleById,
  isLoadedRoles,
  isRoleWithErrors,
  getEntityItems
} from "../redux/selectors";
import Screen from "./Screen";
import { entity } from "../lib/entity";

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
  }
});

export class RoleCreateScreen extends Component {
  state = {
    multiPermissions: [],
    multiUsers: [],
    roleName: "",
    setFormValues: false
  };

  handleChangeMultiPermissions = multiPermissions => {
    this.setState({
      multiPermissions: !!multiPermissions
        ? multiPermissions.split(",").map(v => parseInt(v, 10))
        : []
    });
  };

  handleChangeMultiUsers = multiUsers => {
    this.setState({
      multiUsers: !!multiUsers
        ? multiUsers.split(",").map(v => parseInt(v, 10))
        : []
    });
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentWillMount = () => {
    const {
      fetchPermissions,
      fetchUsers,
      fetchRoles,
      fetchRole,
      id
    } = this.props;
    fetchRoles({});
    fetchPermissions({});
    fetchUsers({});
    if (!!id || id === 0) {
      fetchRole(id);
    }
  };

  componentWillUnmount = () => {
    this.setState({
      multiPermissions: [],
      multiUsers: [],
      roleName: "",
      setFormValues: false
    });
    const { resetRoleCreateState } = this.props;
    resetRoleCreateState();
  };

  componentWillReceiveProps = (props, state) => {
    const { id, roleForEdit, isLoadedRole, isLoadedRoles } = props;
    const { setFormValues } = this.state;

    if (
      (parseInt(id, 10) || parseInt(id, 10) === 0) &&
      !!isLoadedRole &&
      !!isLoadedRoles &&
      !setFormValues
    ) {
      this.setState({
        multiPermissions: roleForEdit.permissions || [],
        multiUsers: roleForEdit.users || [],
        roleName: roleForEdit.name || "",
        setFormValues: true
      });
    }
  };

  handleDelete = () => {
    const { fetchDeleteRole, id } = this.props;
    fetchDeleteRole(id);
  };

  handleSubmit = () => {
    const { fetchCreateRole, fetchEditRole, values: { name }, id } = this.props;
    const { multiPermissions, multiUsers } = this.state;
    !!id || id === 0
      ? fetchEditRole({
          id,
          name,
          permissions: multiPermissions,
          users: multiUsers
        })
      : fetchCreateRole({
          name,
          permissions: multiPermissions,
          users: multiUsers
        });
  };

  //todo: add canSubmit
  //todo: HANDLE trying to view unexisting role
  render() {
    const {
      permissions,
      users,
      isRoleWithErrors,
      isLoaded,
      classes,
      isEdited,
      isSent,
      values,
      id,
      t
    } = this.props;
    const { roleName } = this.state;
    const optionsPermissions = (permissions || []).map(permission => {
      return { value: permission.id, label: permission.name };
    });
    const optionsUsers = (users || []).map(user => {
      return { value: user.id, label: user.username };
    });

    var alert = null;
    if (!!id || id === 0) {
      alert = isEdited ? (
        <div style={{ textAlign: "center" }}>
          {t("role.role_is_edited_msg")}
        </div>
      ) : null;
    } else {
      alert = isEdited ? (
        <div style={{ textAlign: "center" }}>{t("role.role_created_msg")}</div>
      ) : null;
    }

    const loadingScreen = (
      <Screen>
        <div className={classes.progressContainer}>
          <CircularProgress className={classes.progress} />
        </div>
      </Screen>
    );

    /*
    if (!!id || id===0) {
      if (!isLoaded) {
        return loadingScreen;
      }
    }
    */
    if ((!!id || id === 0) && !isSent && !isLoaded) {
      return loadingScreen;
    }

    const canSubmit = values && values.name ? true : false;
    return (
      <Screen>
        <RoleCreateForm
          multiPermissions={this.state.multiPermissions}
          multiUsers={this.state.multiUsers}
          initialValues={{ name: roleName }}
          optionsPermissions={optionsPermissions}
          optionsUsers={optionsUsers}
          handleChangeMultiPermissions={this.handleChangeMultiPermissions}
          handleChangeMultiUsers={this.handleChangeMultiUsers}
          ref={form => (this.form = form)}
          handleDelete={this.handleDelete}
          onSubmit={this.handleSubmit}
          canSubmit={canSubmit}
          id={id}
        />
        {alert}
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={isRoleWithErrors}
          onClose={this.handleClose}
          SnackbarContentProps={{
            "aria-describedby": "message-id"
          }}
          //TODO replace displayed text with the message from the error object.
          message={<span id="message-id">{t("role.error_message")}</span>}
        />
      </Screen>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const id = parseInt(ownProps.match.params.id, 10);

  const isFetchingPerms = isFetchingPermissions(state);
  const timeFetchedPermissions = getTimeFetchedPermissions(state);
  const isCreating = isCreatingRole(state);
  const isEdited = isEditedRole(state);
  const roleCreatedTime = getCreateRoleTimeFetched(state);
  const createRoleError = getCreateRoleError(state);

  return {
    permissions: getPermissions(state),
    users: getEntityItems(entity.user)(state),
    role: state.role.create,
    roleForEdit: getRoleById(id)(state),
    values: getRoleFormValues(state),
    isFetchingPerms,
    isLoaded: !isFetchingPerms && !!timeFetchedPermissions,
    isLoadedRoles: isLoadedRoles(state),
    isLoadedRole: isLoadedRole(state),
    isSent: !isCreating && !!roleCreatedTime && !createRoleError,
    id,
    isEdited,
    isRoleWithErrors: isRoleWithErrors(state)
  };
};

const mapDispatchToProps = {
  fetchPermissions: fetchAll(entity.permission),
  fetchUsers: fetchAll(entity.user),
  fetchCreateRole: fetchCreateByObject(entity.role),
  fetchRoles: fetchAll(entity.role),
  fetchRole: fetchDetailById(entity.role),
  fetchEditRole: fetchUpdateByObject(entity.role),
  fetchDeleteRole: fetchDeleteById(entity.role),
  resetRoleCreateState
};

export const ConnectedCreateScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(RoleCreateScreen);

export default withStyles(styles)(translate()(ConnectedCreateScreen));
