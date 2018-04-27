import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import {
  withStyles,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button
} from "material-ui";
import PropTypes from "prop-types";

import Screen from "../Screen";
import ContactForm from "./ContactForm";

const styles = theme => ({
  card: {
    minWidth: 275
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

export class DetailScreen extends Component {
  render = () => {
    const { classes, t } = this.props;
    const bull = <span className={classes.bullet}>•</span>;

    return (
      <Screen>
        <div>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary">
                Create
              </Typography>
              <Typography variant="headline" component="h2">
                {t("detailScreen.headline", { name: "Max Mustermann" })}
              </Typography>
            </CardContent>
            <ContactForm />
          </Card>
        </div>
      </Screen>
    );
  };
}

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = {};

DetailScreen.propTypes = {
  t: PropTypes.func.isRequired
};

export const ConnectedDetailScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailScreen);

export default withStyles(styles)(translate()(ConnectedDetailScreen));
