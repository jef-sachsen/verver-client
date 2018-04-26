import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import green from "material-ui/colors/green";
import { FormGroup, FormControlLabel } from "material-ui/Form";
import Checkbox from "material-ui/Checkbox";

const styles = {
  root: {
    color: green[600],
    "&$checked": {
      color: green[500]
    }
  },
  checked: {},
  size: {
    width: 40,
    height: 40
  },
  sizeIcon: {
    fontSize: 20
  }
};

/**
 *   state = {
    checkedA: true,
  };

 handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };
 */
class CheckboxLabels extends React.Component {
  render() {
    const { label, checked, name, onChange } = this.props;

    return (
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={event => onChange(name, event.target.checked)}
              value="checked"
              color="primary"
            />
          }
          label={label}
        />
      </FormGroup>
    );
  }
}

CheckboxLabels.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CheckboxLabels);
