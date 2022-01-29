import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";

// @material-ui/icons

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/views/landingPageSections/workStyle.js";
import { setTextRange } from "typescript";

const useStyles = makeStyles(styles);

export default function WorkSection() {
  const classes = useStyles();
  const [plan, setPlan] = React.useState("");
  const [values, setValues] = React.useState({
    amount: "",
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  return (
    <div id="invest" className={classes.section}>
      <GridContainer justify="center">
        <GridItem cs={12} sm={12} md={8}>
          <h2 className={classes.title} style={{ marginBottom: 20 }}>
            Invest Now
          </h2>
          <h4 className={classes.description}>
            Select a plan, decide your amount and proceed.
          </h4>
          <form>
            <GridContainer>
              {/* <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  labelText="Your Name"
                  id="name"
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  labelText="Your Email"
                  id="email"
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </GridItem> */}

              <GridItem xs={12} sm={12} md={6} style={{ marginTop: 20 }}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="standard-adornment-amount">
                    Amount
                  </InputLabel>
                  <Input
                    id="standard-adornment-amount"
                    type="number"
                    value={values.amount}
                    onChange={handleChange("amount")}
                    startAdornment={
                      <InputAdornment position="start">
                        <i className="fab fa-ethereum"></i>{" "}
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </GridItem>
              <GridItem xs={12} sm={12} md={6} style={{ marginTop: 20 }}>
                <FormControl>
                  <InputLabel htmlFor="plan-native-simple">
                    Select Plan
                  </InputLabel>
                  <Select
                    native
                    style={{
                      width: 300,
                    }}
                    value={plan}
                    onChange={(value) => setPlan(value)}
                    inputProps={{
                      name: "plan",
                      id: "plan-native-simple",
                    }}
                  >
                    <option aria-label="None" value="" />
                    <option value="Monthly">Monthly</option>
                    <option value="Quaterly">Quaterly</option>
                    <option value="Annually">Annually</option>
                  </Select>
                </FormControl>
              </GridItem>
            </GridContainer>
            <div align="center">
              <Button color="primary" style={{ marginTop: 50 }}>
                Invest
              </Button>
            </div>
          </form>
        </GridItem>
      </GridContainer>
    </div>
  );
}
