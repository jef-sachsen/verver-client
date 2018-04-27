import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { CircularProgress, withStyles, Snackbar } from "material-ui";
import { get } from "lodash";
import UserCreateForm from "./UserCreateForm";
import {
  fetchCreateByObject,
  fetchDeleteById,
  fetchUpdateByObject,
  fetchDetailById,
  fetchAll,
  resetUserCreateState
} from "../redux/actions";
import {
  getTimeFetchedUsers,
  isFetchingUsers,
  getUserFormValues,
  isCreatingUser,
  isEditedUser,
  getTimeFetchedUserList,
  getCreateUserError,
  getUserById,
  isLoadedUsers,
  isLoadedUser,
  isUserWithErrors,
  getEntityItems,
  getUserIdFromToken
} from "../redux/selectors";
import Screen from "./Screen";
import PropTypes from "prop-types";
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

export class UserCreateScreen extends Component {
  state = {
    singleContact: "",
    multiRoles: [],
    multiGroups: [],
    username: "",
    password: "",
    checkedAdmin: false,
    checkedEnabled: false,
    setFormValues: false
  };

  handleChange = name => value => {
    this.setState({
      [name]: !!value ? value.split(",").map(v => parseInt(v, 10)) : []
    });
  };

  handleChangeSingle = name => value => {
    this.setState({
      [name]: value
    });
  };

  handleChangeCheckbox = (name, checked) => {
    this.setState({ [name]: checked });
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentWillMount = () => {
    const {
      fetchUsers,
      fetchContacts,
      fetchRoles,
      fetchGroups,
      fetchUser,
      id
    } = this.props;
    fetchUsers();
    fetchContacts();
    fetchRoles();
    fetchGroups();
    if (!!id || id === 0) {
      fetchUser(id);
    }
  };

  componentWillUnmount = () => {
    this.setState({
      singleContact: "",
      multiRoles: [],
      multiGroups: [],
      username: "",
      password: "",
      checkedAdmin: false,
      checkedEnabled: false,
      setFormValues: false
    });
    const { resetUserCreateState } = this.props;
    resetUserCreateState();
  };

  componentWillReceiveProps = props => {
    const { id, userForEdit, isLoadedUser, isLoadedUsers } = props;
    const { setFormValues } = this.state;

    if (
      (parseInt(id, 10) || parseInt(id, 10) === 0) &&
      !!isLoadedUser &&
      !!isLoadedUsers &&
      !setFormValues
    ) {
      this.setState({
        username: userForEdit.username || "",
        singleContact: parseInt(userForEdit.contact, 10) || "",
        multiRoles: userForEdit.roles || [],
        multiGroups: userForEdit.groups || [],
        checkedAdmin: userForEdit.admin || false,
        checkedEnabled: userForEdit.enabled || false,
        setFormValues: true
      });
    }
  };

  handleDelete = () => {
    const { fetchDeleteUser, id } = this.props;
    fetchDeleteUser(id);
  };

  handleSubmit = () => {
    const {
      fetchCreateUser,
      fetchEditUser,
      values: { username, password },
      id
    } = this.props;

    const {
      singleContact,
      multiRoles,
      multiGroups,
      checkedAdmin,
      checkedEnabled
    } = this.state;

    var data = {
      username,
      password,
      enabled: checkedAdmin,
      admin: checkedEnabled,
      roles: multiRoles,
      groups: multiGroups
    };

    //TODO replace enabled and admin with variables
    if (!!id || id === 0) {
      data.id = id;
      if (!!singleContact || singleContact === 0) {
        data.contact = parseInt(singleContact, 10);
      }
      fetchEditUser(data);
    } else {
      if (!!singleContact || singleContact === 0) {
        data.contact = parseInt(singleContact, 10);
      }
      fetchCreateUser(data);
    }
  };

  render() {
    const {
      contacts,
      roles,
      groups,
      isLoaded,
      classes,
      isSent,
      isEdited,
      isUserWithErrors,
      values,
      id,
      t
    } = this.props;
    const {
      username,
      singleContact,
      multiRoles,
      multiGroups,
      checkedAdmin,
      checkedEnabled
    } = this.state;

    console.log();
    var alert = null;
    if (!!id || id === 0) {
      alert = isEdited ? (
        <div style={{ textAlign: "center" }}>
          {t("user.user_is_edited_msg")}
        </div>
      ) : null;
    } else {
      alert = isEdited ? (
        <div style={{ textAlign: "center" }}>{t("user.user_created_msg")}</div>
      ) : null;
    }

    const mappedRoles = (roles || []).map(role => {
      return {
        value: role.id,
        label: role.name
      };
    });

    const mappedGroups = (groups || []).map(group => {
      return {
        value: group.id,
        label: group.name
      };
    });

    const mappedContacts = (contacts || []).map(contact => {
      return {
        value: contact.id,
        label: contact.lastName + ", " + contact.firstName
      };
    });

    const loadingScreen = (
      <Screen>
        <div className={classes.progressContainer}>
          <CircularProgress className={classes.progress} />
        </div>
      </Screen>
    );

    if (id) {
      if (!isLoaded) {
        return loadingScreen;
      }
    }

    if (!!id && !isSent && !isLoaded) {
      return loadingScreen;
    }
    // we don't show password in edit form, so it's not necessary to update it
    var canSubmit;
    if (!!id || id === 0) {
      canSubmit = values && values.username ? true : false;
    } else {
      canSubmit = values && values.username && values.password ? true : false;
    }

    return (
      <Screen>
        <UserCreateForm
          initialValues={{ username: username }}
          multiRoles={multiRoles}
          multiGroups={multiGroups}
          singleContact={singleContact}
          handleChange={this.handleChange}
          handleChangeSingle={this.handleChangeSingle}
          handleChangeCheckbox={this.handleChangeCheckbox}
          checkedAdmin={checkedAdmin}
          checkedEnabled={checkedEnabled}
          roles={mappedRoles}
          groups={mappedGroups}
          contacts={mappedContacts}
          handleDelete={this.handleDelete}
          ref={form => (this.form = form)}
          onSubmit={this.handleSubmit}
          canSubmit={canSubmit}
          id={id}
        />
        {alert}
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={isUserWithErrors}
          onClose={this.handleClose}
          SnackbarContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">{t("user.error_message")}</span>}
        />
      </Screen>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const isProfile = get(ownProps, "match.path") === "/profile";
  const id = isProfile
    ? getUserIdFromToken(state)
    : parseInt(ownProps.match.params.id, 10);
  const isFetching = isFetchingUsers(state);
  //todo replace with timeFetchedUsers
  const timeFetchedUsers = getTimeFetchedUsers(state);

  const isCreating = isCreatingUser(state);
  const isEdited = isEditedUser(state);
  const groupCreatedTime = getTimeFetchedUserList(state);
  const createUserError = getCreateUserError(state);
  return {
    users: getEntityItems(entity.user)(state),
    roles: getEntityItems(entity.role)(state),
    groups: getEntityItems(entity.group)(state),
    contacts: getEntityItems(entity.contact)(state),

    values: getUserFormValues(state),
    isFetching,
    isLoaded: !isFetching && !!timeFetchedUsers,
    isSent: !isCreating && !!groupCreatedTime && !createUserError,
    isEdited,
    id,
    userForEdit: getUserById(id)(state),
    isLoadedUsers: isLoadedUsers(state),
    isLoadedUser: isLoadedUser(state),
    isUserWithErrors: isUserWithErrors(state)
  };
};

const mapDispatchToProps = {
  fetchUsers: fetchAll(entity.user),
  fetchRoles: fetchAll(entity.role),
  fetchGroups: fetchAll(entity.group),
  fetchContacts: fetchAll(entity.contact),

  fetchCreateUser: fetchCreateByObject(entity.user),
  fetchUser: fetchDetailById(entity.user),
  fetchEditUser: fetchUpdateByObject(entity.user),
  resetUserCreateState,
  fetchDeleteUser: fetchDeleteById(entity.user)
};

UserCreateScreen.propTypes = {
  t: PropTypes.func.isRequired
};

export const ConnectedUserCreateScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserCreateScreen);

export default withStyles(styles)(translate()(ConnectedUserCreateScreen));
