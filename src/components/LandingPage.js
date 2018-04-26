import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "react-router-redux";
import Screen from "./Screen";

class LandingPage extends Component {
  componentDidMount = () => {
    const { push } = this.props;
    push("/user/list");
  };

  render() {
    return <Screen />;
  }
}

export default connect(null, { push: push })(LandingPage);
