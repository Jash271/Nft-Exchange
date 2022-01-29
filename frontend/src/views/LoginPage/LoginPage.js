import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import { Link } from "react-router-dom";
import GoogleLogin from "react-google-login";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import SnackbarContent from "components/Snackbar/SnackbarContent";

import styles from "assets/jss/material-kit-react/views/loginPage.js";

import image from "assets/img/bg7.jpg";

const useStyles = makeStyles(styles);

export default function LoginPage(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  setTimeout(function () {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = () => {
    if (!email) {
      setError("Please enter an Email");
    } else if (!password) {
      setError("Please enter a Password");
    } else {
      setError("");
      localStorage.setItem("token", "123");
      window.location.href = "/";
    }
  };

  const responseGoogle = (response) => {
    console.log(response);
    localStorage.setItem("profile", JSON.stringify(response.profileObj));
    localStorage.setItem("token", response.tokenId);
    window.location.href = "/";
  };

  useEffect(() => {
    // Integration - Page: Login | Path: '/login'
  }, []);
  return (
    <div>
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={5}>
              <Card className={classes[cardAnimaton]}>
                <form className={classes.form}>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h4>Login</h4>
                    <div className={classes.socialLine}>
                      <Button
                        justIcon
                        href="#"
                        target="_blank"
                        color="transparent"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className={"fab fa-twitter"} />
                      </Button>
                      <Button
                        justIcon
                        href="#"
                        target="_blank"
                        color="transparent"
                        onClick={(e) => e.preventDefault()}
                      >
                        <i className={"fab fa-facebook"} />
                      </Button>
                      <GoogleLogin
                        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                        buttonText=""
                        onSuccess={responseGoogle}
                        onFailure={(e) => {
                          console.log(e);
                          setError("Something went wrong");
                        }}
                        cookiePolicy={"single_host_origin"}
                        render={(renderProps) => (
                          <Button
                            justIcon
                            color="transparent"
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}
                          >
                            <i className={"fab fa-google-plus-g"} />
                          </Button>
                        )}
                      />
                    </div>
                  </CardHeader>
                  <p className={classes.divider}>Or Be Classical</p>
                  <CardBody>
                    {error && (
                      <SnackbarContent
                        message={
                          <span>
                            <b>Error:</b> {error}
                          </span>
                        }
                        close
                        color="danger"
                        icon="info_outline"
                      />
                    )}
                    <CustomInput
                      labelText="Email..."
                      id="email"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        value: email,
                        onChange: (e) => setEmail(e.target.value),
                        type: "email",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <CustomInput
                      labelText="Password"
                      id="pass"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        value: password,
                        onChange: (e) => setPassword(e.target.value),
                        type: "password",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className={classes.inputIconsColor}>
                              lock_outline
                            </Icon>
                          </InputAdornment>
                        ),
                        autoComplete: "off",
                      }}
                    />
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button round color="primary" onClick={handleSubmit}>
                      Get started
                    </Button>
                  </CardFooter>
                  <div
                    align="center"
                    style={{ marginTop: -20, marginBottom: 30 }}
                  >
                    <Link to="/signup">Sign Up</Link>
                  </div>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    </div>
  );
}
