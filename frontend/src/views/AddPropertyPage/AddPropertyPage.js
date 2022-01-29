import React, { useState, useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
// @material-ui/icons
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import Check from "@material-ui/icons/Check";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import PinDropIcon from "@material-ui/icons/PinDrop";
import ExploreIcon from "@material-ui/icons/Explore";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
// core components
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
import Card from "components/Card/Card.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import InputAdornment from "@material-ui/core/InputAdornment";
import SnackbarContent from "components/Snackbar/SnackbarContent";

import styles from "assets/jss/material-kit-react/views/portfolioPage.js";
import { cardTitle } from "assets/jss/material-kit-react.js";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepConnector from "@material-ui/core/StepConnector";
import PropTypes from "prop-types";
import { Typography } from "@material-ui/core";
import { StoreMallDirectorySharp } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

import nft from "../../Ethereum/nft.js";
import web3 from "../../Ethereum/web3";

const { create } = require("ipfs-http-client");
const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

styles.cardTitle = cardTitle;
const useStyles = makeStyles(styles);

/*  Stepper  */
const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  active: {
    "& $line": {
      borderColor: "#784af4",
    },
  },
  completed: {
    "& $line": {
      borderColor: "#784af4",
    },
  },
  line: {
    borderColor: "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
  root: {
    color: "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
  },
  active: {
    color: "#784af4",
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  completed: {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18,
  },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed ? (
        <Check className={classes.completed} />
      ) : (
        <div className={classes.circle} />
      )}
    </div>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   */
  active: PropTypes.bool,
  /**
   * Mark the step as completed. Is passed to child components.
   */
  completed: PropTypes.bool,
};

function getSteps() {
  return ["Basic Information", "Verification Documents", "All Set"];
}

export default function AddListingPage() {
  const classes = useStyles();
  const history = useHistory();
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();
  const [selectedFile, setSelectedFile] = useState("");
  const [display, setDisplay] = useState(null);
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState({
    name: "",
    description: "",
    // city: "",
    // state: "",
    // zip: "",
    // carpetArea: "",
    image: "",
    document1: null,
  });
  const handleChange = (event) => {
    setProperty({
      ...property,
      [event.target.name]: event.target.value || event.target.checked,
    });
  };

  const handleProceed = () => {
    if (activeStep === 0) {
      if (!property.name) {
        setError("Please enter a name for your listing.");
        return;
      } else if (!property.description) {
        setError("Please enter an description for your listing.");
        return;
      }
      //   else if (!property.city) {
      //     setError("Please enter the city of your listing.");
      //     return;
      //   } else if (!property.state) {
      //     setError("Please enter the state of your listing.");
      //     return;
      //   } else if (!property.zip) {
      //     setError("Please enter the zip code of your listing.");
      //     return;
      //   } else if (!property.carpetArea) {
      //     setError("Please enter the carpet area of your listing.");
      //     return;
      //   }
      // } else if (activeStep === 1) {
      //   if (!property.document1) {
      //     setError("Please upload all the documents for verification.");
      //     return;
      //   }
      setError("");
      setLoading(true);
      //setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setNFTimage();
    }
  };
  const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);

  useEffect(() => {
    if (property.image) {
      Storedata();
    }
  }, [property.image]);

  const Storedata = async () => {
    const hash = await ipfs.add(JSON.stringify(property));
    // console.log(hash.path);

    const address = localStorage.getItem("token");
    const accounts = await web3.eth.getAccounts();

    try {
      await nft.methods
        .createNFT(`https://ipfs.io/ipfs/${hash.path}`)
        .send({ from: accounts[0] });
    } catch (error) {
      alert(error.message);
      return;
    }
  };

  const CaptureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    // console.log(file);
    setDisplay(file);
    let reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    setSelectedFile(file);
  };

  const setNFTimage = async () => {
    // event.preventDefault();
    const ipfsHash = await ipfs.add(selectedFile);
    // console.log(ipfsHash.path);
    setProperty({
      ...property,
      image: `https://ipfs.io/ipfs/${ipfsHash.path}`,
    });
  };

  return (
    <div>
      <Dialog
        open={loading}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Processing Request</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            We are processing your request, this may take upto 2 minutes. Please
            confirm the transaction on your metamask wallet. You may leave this
            page if you do not wish to wait. If you have enabled notifications
            for the Metamask extension then you will be notified when the
            transaction is complete.
            <br />
            <Link to="/portfolio">Click here</Link> to visit your portfolio
            page.
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Parallax small filter image={require("assets/img/sell.jpg").default} />
      <div className={classNames(classes.main, classes.mainRaisedHigh)}>
        <div>
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={6}>
                <div align="center" style={{ color: "#7F7F7F" }}>
                  <h3 className={classes.title}>Add NFT</h3>
                </div>
              </GridItem>
            </GridContainer>
            <div className={classes.description} style={{ marginTop: -10 }}>
              <p>Add a new NFT to your digital portfolio.</p>
            </div>
            {/* <Stepper
              alternativeLabel
              activeStep={activeStep}
              connector={<QontoConnector />}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={QontoStepIcon}>
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper> */}
            <Card style={{ padding: 20, marginBottom: 20 }}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={4} className={classes.navWrapper}>
                  <input
                    style={{ display: "none" }}
                    onChange={CaptureFile}
                    // onChange={(e) => {
                    //   if (e.target.files[0]) {
                    //     if (e.target.files[0].size < 2097152) {
                    //       setProperty({
                    //         ...property,
                    //         image: e.target.files[0],
                    //       });
                    //     } else {
                    //       setError("File Size must be under 2MB");
                    //     }
                    //   }
                    // }}
                    name="image"
                    type="file"
                    accept="image/*"
                    id="propertyImg1"
                  />
                  {display ? (
                    <>
                      <img
                        src={URL.createObjectURL(display)}
                        alt={display.name}
                        style={{ maxHeight: "100%", maxWidth: "100%" }}
                      />
                      <label htmlFor="propertyImg1">
                        <Button
                          variant="contained"
                          color="primary"
                          component="span"
                          className={classes.button}
                          startIcon={<CloudUploadIcon />}
                        >
                          Change Image
                        </Button>
                      </label>
                    </>
                  ) : (
                    <div
                      style={{
                        height: 300,
                        paddingTop: "40%",
                        backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='silver' stroke-width='3' stroke-dasharray='15%2c 15%2c 1' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
                      }}
                    >
                      <label htmlFor="propertyImg1">
                        <Button
                          variant="contained"
                          color="primary"
                          component="span"
                          className={classes.button}
                          startIcon={<CloudUploadIcon />}
                        >
                          Upload Image
                        </Button>
                      </label>
                    </div>
                  )}
                </GridItem>
                <GridItem xs={12} sm={12} md={8} className={classes.navWrapper}>
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
                  {activeStep === 0 ? (
                    <>
                      <CustomInput
                        labelText="Name *"
                        id="name"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          name: "name",
                          value: property.name || "",
                          onChange: handleChange,
                          placeholder: "NFT Name",
                          startAdornment: (
                            <InputAdornment position="start">
                              <HomeWorkIcon
                                className={classes.inputIconsColor}
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <CustomInput
                        labelText="Description *"
                        id="description"
                        formControlProps={{
                          fullWidth: true,
                        }}
                        inputProps={{
                          name: "description",
                          value: property.description || "",
                          onChange: handleChange,
                          placeholder: "NFT Description",
                          startAdornment: (
                            <InputAdornment position="start">
                              <ExploreIcon
                                className={classes.inputIconsColor}
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <div align="left">
                        {/* <GridContainer>
                            <GridItem xs={4}>
                              <CustomInput
                                labelText="City *"
                                id="city"
                                inputProps={{
                                  name: "city",
                                  value: property.city || "",
                                  onChange: handleChange,
                                  placeholder: "City Name",
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <LocationCityIcon
                                        className={classes.inputIconsColor}
                                      />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </GridItem>
                            <GridItem xs={4}>
                              <CustomInput
                                labelText="State *"
                                id="state"
                                inputProps={{
                                  name: "state",
                                  value: property.state || "",
                                  onChange: handleChange,
                                  placeholder: "State Name",
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <LocationOnIcon
                                        className={classes.inputIconsColor}
                                      />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </GridItem>
                            <GridItem xs={4}>
                              <CustomInput
                                labelText="Zip Code *"
                                id="zip"
                                inputProps={{
                                  name: "zip",
                                  type: "number",
                                  value: property.zip || "",
                                  onChange: handleChange,
                                  placeholder: "Zip Code",
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <PinDropIcon
                                        className={classes.inputIconsColor}
                                      />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </GridItem>
                          </GridContainer> */}
                        {/* <CustomInput
                            labelText="Carpet Area *"
                            id="carpetArea"
                            formControlProps={{
                              fullWidth: true,
                            }}
                            inputProps={{
                              name: "carpetArea",
                              type: "number",
                              value: property.carpetArea || "",
                              onChange: handleChange,
                              placeholder: "Carpet Area in square foot",
                              startAdornment: (
                                <InputAdornment position="start">
                                  <HomeWorkIcon
                                    className={classes.inputIconsColor}
                                  />
                                </InputAdornment>
                              ),
                            }}
                          /> */}
                      </div>
                    </>
                  ) : (
                    <>
                      <div align="left">
                        <GridContainer>
                          <GridItem xs={4}>
                            <Typography variant="h5" style={{ marginTop: 10 }}>
                              Document 1:
                            </Typography>
                          </GridItem>
                          <GridItem xs={6}>
                            <input
                              style={{ display: "none" }}
                              onChange={(e) => {
                                if (e.target.files[0]) {
                                  if (e.target.files[0].size < 2097152) {
                                    setProperty({
                                      ...property,
                                      document1: e.target.files[0],
                                    });
                                  } else {
                                    setError("File Size must be under 2MB");
                                  }
                                }
                              }}
                              name="document1"
                              type="file"
                              id="document1"
                            />
                            <label htmlFor="document1">
                              <Button
                                variant="contained"
                                color="primary"
                                component="span"
                                className={classes.button}
                                startIcon={<CloudUploadIcon />}
                              >
                                Upload Document
                              </Button>
                            </label>{" "}
                            <br />
                            {property.document1?.name}
                          </GridItem>
                          <GridItem xs={4}>
                            <Typography variant="h5" style={{ marginTop: 10 }}>
                              Document 2:
                            </Typography>
                          </GridItem>
                          <GridItem xs={6}>
                            <input
                              style={{ display: "none" }}
                              onChange={(e) => {
                                if (e.target.files[0]) {
                                  if (e.target.files[0].size < 2097152) {
                                    setProperty({
                                      ...property,
                                      document2: e.target.files[0],
                                    });
                                  } else {
                                    setError("File Size must be under 2MB");
                                  }
                                }
                              }}
                              name="document2"
                              type="file"
                              id="document2"
                            />
                            <label htmlFor="document2">
                              <Button
                                variant="contained"
                                color="primary"
                                component="span"
                                className={classes.button}
                                startIcon={<CloudUploadIcon />}
                              >
                                Upload Document
                              </Button>
                            </label>
                          </GridItem>
                        </GridContainer>
                      </div>
                    </>
                  )}
                  <CardFooter className={classes.cardFooter}>
                    <Button
                      round
                      color={!loading ? "primary" : "secondary"}
                      onClick={handleProceed}
                      style={{ marginLeft: "auto" }}
                      disabled={loading}
                    >
                      Submit
                    </Button>
                  </CardFooter>
                </GridItem>
              </GridContainer>
            </Card>
            <br />
          </div>
        </div>
      </div>
    </div>
  );
}
