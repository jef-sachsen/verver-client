import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { CircularProgress, withStyles, Snackbar } from "material-ui";
import { permission } from "../config/groupPermissionTypes";

import GroupCreateForm from "./GroupCreateForm";
import {
  fetchList,
  fetchCreateByObject,
  fetchDeleteById,
  fetchUpdateByObject,
  fetchDetailById,
  resetGroupCreateState
} from "../redux/actions";
import {
  getUsers,
  getGroupFormValues,
  getTimeFetchedUsers,
  isFetchingUsers,
  isCreatingGroup,
  getCreateGroupTimeFetched,
  getCreateGroupError,
  isEditedGroup,
  getGroupById,
  isLoadedGroups,
  isLoadedGroup,
  isGroupWithErrors
} from "../redux/selectors";
import Screen from "./Screen";
import PropTypes from "prop-types";
import { entity } from "../lib/entity";
import { getContacts } from "../redux/selectors/contactsSelectors";

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

export class GroupCreateScreen extends Component {
  state = {
    singlePermission: "",
    multiUsers: [],
    multiContacts: [],
    multiResponsibles: [],
    groupName: "",
    groupDescription: "",
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

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentWillMount = () => {
    const { fetchUsers, fetchContacts, id, fetchGroup } = this.props;
    fetchUsers({});
    fetchContacts({});
    if (!!id || id === 0) {
      fetchGroup(id);
    }
  };

  componentWillUnmount = () => {
    this.setState({
      groupName: "",
      singlePermission: "",
      multiUsers: [],
      multiContacts: [],
      multiResponsibles: [],
      setFormValues: false
    });
    const { resetGroupCreateState } = this.props;
    resetGroupCreateState();
  };

  componentWillReceiveProps = props => {
    const { id, groupForEdit, isLoadedGroup, isLoadedGroups } = props;
    const { setFormValues } = this.state;

    if (
      (parseInt(id, 10) || parseInt(id, 10) === 0) &&
      !!isLoadedGroup &&
      !!isLoadedGroups &&
      !setFormValues
    ) {
      this.setState({
        groupName: groupForEdit.name || "",
        singlePermission: groupForEdit.permission || "",
        multiUsers: groupForEdit.users || [],
        multiContacts: groupForEdit.contacts || [],
        multiResponsibles: groupForEdit.responsibles || [],
        setFormValues: true
      });
    }
  };

  handleDelete = () => {
    const { fetchDeleteGroup, id } = this.props;
    fetchDeleteGroup(id);
  };

  handleSubmit = () => {
    const {
      fetchCreateGroup,
      fetchEditGroup,
      values: { name },
      id
    } = this.props;

    const {
      singlePermission,
      multiUsers,
      multiContacts,
      multiResponsibles
    } = this.state;

    !!(id || id === 0)
      ? fetchEditGroup({
          id,
          name,
          permission: singlePermission,
          users: multiUsers,
          contacts: multiContacts,
          responsibles: multiResponsibles
        })
      : fetchCreateGroup({
          name,
          permission: singlePermission,
          users: multiUsers,
          contacts: multiContacts,
          responsibles: multiResponsibles
        });
  };

  //todo: add canSubmit
  render() {
    const {
      users,
      contacts,
      isLoaded,
      classes,
      isSent,
      isEdited,
      isGroupWithErrors,
      values,
      id,
      t
    } = this.props;
    const {
      groupName,
      groupDescription,
      multiUsers,
      multiContacts,
      multiResponsibles,
      singlePermission
    } = this.state;

    var alert = null;
    if (!!id) {
      alert = isEdited ? (
        <div style={{ textAlign: "center" }}>
          {t("group.group_is_edited_msg")}
        </div>
      ) : null;
    } else {
      alert = isEdited ? (
        <div style={{ textAlign: "center" }}>
          {t("group.group_created_msg")}
        </div>
      ) : null;
    }

    const mappedUsers = (users || []).map(user => {
      return { value: user.id, label: user.username };
    });

    const mappedContacts = (contacts || []).map(contact => {
      return {
        value: contact.id,
        label: contact.lastName + ", " + contact.firstName
      };
    });

    const mappedPermission = permission.map(permission => {
      return { value: permission.value, label: permission.label };
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

    const canSubmit = values && values.name ? true : false;

    return (
      <Screen>
        <GroupCreateForm
          initialValues={{ name: groupName, description: groupDescription }}
          multiUsers={multiUsers}
          multiContacts={multiContacts}
          multiResponsibles={multiResponsibles}
          singlePermission={singlePermission}
          handleChange={this.handleChange}
          handleChangeSingle={this.handleChangeSingle}
          users={mappedUsers}
          contacts={mappedContacts}
          permissionToChoose={mappedPermission}
          handleDelete={this.handleDelete}
          ref={form => (this.form = form)}
          onSubmit={this.handleSubmit}
          canSubmit={canSubmit}
          id={id}
        />
        {alert}
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={isGroupWithErrors}
          onClose={this.handleClose}
          SnackbarContentProps={{
            "aria-describedby": "message-id"
          }}
          //TODO replace displayed text with the message from the error object.
          message={<span id="message-id">{t("group.error_message")}</span>}
        />
      </Screen>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  //todo remove parseInts from above
  const id = parseInt(ownProps.match.params.id, 10);
  const isFetching = isFetchingUsers(state);
  //todo replace with timeFetchedUsers
  const timeFetchedUsers = getTimeFetchedUsers(state);
  const isCreating = isCreatingGroup(state);
  const isEdited = isEditedGroup(state);
  const groupCreatedTime = getCreateGroupTimeFetched(state);
  const createGroupError = getCreateGroupError(state);
  return {
    users: getUsers(state),
    contacts: getContacts(state),
    group: state.group.create,
    values: getGroupFormValues(state),
    isFetching,
    isLoaded: !isFetching && !!timeFetchedUsers,
    isSent: !isCreating && !!groupCreatedTime && !createGroupError,
    isEdited,
    id,
    groupForEdit: getGroupById(id)(state),
    isLoadedGroups: isLoadedGroups(state),
    isLoadedGroup: isLoadedGroup(state),
    isGroupWithErrors: isGroupWithErrors(state)
  };
};

const mapDispatchToProps = {
  fetchUsers: fetchList(entity.user),
  fetchContacts: fetchList(entity.contact),
  fetchCreateGroup: fetchCreateByObject(entity.group),
  fetchGroup: fetchDetailById(entity.group),
  fetchEditGroup: fetchUpdateByObject(entity.group),
  resetGroupCreateState,
  fetchDeleteGroup: fetchDeleteById(entity.group)
};

GroupCreateScreen.propTypes = {
  t: PropTypes.func.isRequired
};

export const ConnectedCreateScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupCreateScreen);

export default withStyles(styles)(translate()(ConnectedCreateScreen));
