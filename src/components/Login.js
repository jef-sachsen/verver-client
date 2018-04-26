import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import { Snackbar } from "material-ui";

import LoginForm from "./LoginForm";
import { fetchLogin } from "../redux/actions";
import { getLoginFormValues, getLoginError } from "../redux/selectors";

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
  }

  componentWillReceiveProps(nextProps) {
    const { error } = this.props;
    if (error !== nextProps.error) {
      this.setState({
        error
      });
    }
  }

  handleClose = () => {
    this.setState({ error: null });
  };

  submit = values => {
    const { fetchLogin, values: { username, password } } = this.props;
    fetchLogin(username, password);
  };

  render() {
    const { values } = this.props;
    const { error } = this.state;

    const canSubmit =
      values && values.username && values.password ? true : false;

    return (
      <div>
        <LoginForm
          ref={form => (this.form = form)}
          initialValues={{ username: "", password: "" }}
          onSubmit={this.submit}
          canSubmit={canSubmit}
        />
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={!!error}
          onClose={this.handleClose}
          SnackbarContentProps={{
            "aria-describedby": "message-id"
          }}
          //TODO replace displayed tex with the message from the error object.
          message={<span id="message-id">Failed to Login</span>}
        />
      </div>
    );
  }
}

Login.propTypes = {
  t: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    values: getLoginFormValues(state),
    error: getLoginError(state)
  };
};

const mapDispatchToProps = {
  fetchLogin
};
/*
mapDispatchToProps above does the same like:
const mapDispatchToProps = dispatch => ({
    fetchLogin: () => dispatch(fetchLogin())
});
 */

export const ConnectedLogin = connect(mapStateToProps, mapDispatchToProps)(
  Login
);

export default translate()(ConnectedLogin);
