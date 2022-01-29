import React, { useState, useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import ExploreIcon from "@material-ui/icons/Explore";
import LocalAtmIcon from "@material-ui/icons/LocalAtm";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
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

import nft from "../../Ethereum/nft.js";
import web3 from "../../Ethereum/web3";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { getAllJSDocTags } from "typescript";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
styles.cardTitle = cardTitle;
const useStyles = makeStyles(styles);

export default function AddListingPage() {
  const { id } = useParams();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const address = localStorage.getItem("token");
  const [error, setError] = useState("");
  const [property, setProperty] = useState({
    name: "NFT Name",
    price: "",
    description: "",
    instantPrice: "",
    // visitingHours: "",
    // streetAddress: "Street Address",
    // city: "City",
    // state: "State",
    // zip: "400050",
    image: "https://picsum.photos/400/300",
    auction: false,
  });
  const handleChange = (event) => {
    setProperty({
      ...property,
      [event.target.name]: event.target.value || event.target.checked,
    });
  };

  const handleProceed = async () => {
    if (!property.price) {
      setError("Please enter the price of your listing.");
      return;
    } else if (!property.instantPrice && property.auction) {
      setError("Please enter the price of your auction listing");
      return;
    }
    setError("");
    setLoading(true);

    if (property.auction) {
      //hasura api call
    } else {
      let final_price = await web3.utils
        .toWei(`${property.price}`, "ether")
        .toString();

      const accounts = await web3.eth.getAccounts();

      try {
        await nft.methods
          .listNFT(parseInt(id), final_price)
          .send({ from: accounts[0] });
      } catch (error) {
        setError(error.message);
        return;
      }
    }
    await submitAuction();
  };
  const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);

  const getData = async () => {
    try {
      const res = await nft.methods.nftDetails(id).call();
      // console.log(res);
      const data = await fetch(res.ipfsHash);
      const resp1 = await data.json();
      setProperty({ ...resp1, res });
      // console.log(resp1, res);
    } catch (error) {
      alert(error.message);
      return;
    }
  };

  const submitAuction = async () => {
    var axios = require("axios");
    let numWeeks = 1;
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + numWeeks * 7);
    var data = property.auction
      ? JSON.stringify({
          query: `mutation MyMutation {
      insert_Auction(objects: {active: true, base_price: ${
        property.price
      }, instant_price: ${
            property.instantPrice
          }, end_time: "${endDate.toDateString()}", nft_id: "${id}", start_time: "${new Date().toDateString()}"}) {
        returning {
          a_id
          active
          base_price
          end_time
          nft_id
          start_time
          instant_price
        }
      }
    }`,
          variables: {},
        })
      : JSON.stringify({
          query: `mutation MyMutation {
        insert_nft_listing(objects: {cat: "sell", price: ${property.price}, nft_id: "${id}", on_sell: true}) {
          returning {
            cat
            id
            price
            nft_id
            on_sell
          }
        }
      }`,
        });
    console.log(data);

    var config = {
      method: "post",
      url: "https://better-gibbon-14.hasura.app/v1/graphql",
      headers: {
        "x-hasura-admin-secret":
          "AyEk6fdXM2ZeBddCkusR2djYfINvXB9167AC7lFNiOWZ5UZImQ08kyoURdGpAZgo",
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
        history.push("/market");
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <Backdrop open={loading} style={{ zIndex: 999999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Parallax small filter image={require("assets/img/sell.jpg").default} />
      <div className={classNames(classes.main, classes.mainRaisedHigh)}>
        <div>
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={6}>
                <div align="center" style={{ color: "#7F7F7F" }}>
                  <h3 className={classes.title}>Add Listing</h3>
                </div>
              </GridItem>
            </GridContainer>
            <div className={classes.description} style={{ marginTop: -10 }}>
              <p>List your NFT for sale or auction.</p>
            </div>
            <Card style={{ padding: 20, marginBottom: 20 }}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={4} className={classes.navWrapper}>
                  <img
                    src={property.image}
                    alt={property.name}
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  />
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
                      disabled: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <HomeWorkIcon className={classes.inputIconsColor} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <CustomInput
                    labelText="description *"
                    id="description"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "description",
                      value: property.description || "",
                      disabled: true,
                      onChange: handleChange,
                      placeholder: "NFT description",
                      startAdornment: (
                        <InputAdornment position="start">
                          <ExploreIcon className={classes.inputIconsColor} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <div align="left">
                    <GridContainer>
                      {/* <GridItem xs={4}>
                        <CustomInput
                          labelText="City *"
                          id="city"
                          inputProps={{
                            name: "city",
                            value: property.city || "",
                            disabled: true,
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
                            disabled: true,
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
                            disabled: true,
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
                      </GridItem> */}
                      <GridItem xs={4}>
                        <CustomInput
                          labelText={
                            property.auction
                              ? "Starting Price *"
                              : "List Price *"
                          }
                          id="price"
                          inputProps={{
                            name: "price",
                            type: "number",
                            value: property.price || "",
                            onChange: handleChange,
                            placeholder: "Price in Eth",
                            startAdornment: (
                              <InputAdornment position="start">
                                <MonetizationOnIcon
                                  className={classes.inputIconsColor}
                                />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </GridItem>
                      {property.auction ? (
                        <GridItem xs={4}>
                          <CustomInput
                            labelText="Instant Buy Price"
                            id="instantPrice"
                            inputProps={{
                              name: "instantPrice",
                              type: "number",
                              value: property.instantPrice || "",
                              onChange: handleChange,
                              placeholder: "Price in INR",
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LocalAtmIcon
                                    className={classes.inputIconsColor}
                                  />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </GridItem>
                      ) : (
                        <GridItem xs={6} />
                      )}
                    </GridContainer>

                    <FormControlLabel
                      style={{ marginTop: 5 }}
                      control={
                        <Switch
                          checked={property.auction}
                          color="primary"
                          onChange={handleChange}
                          name="auction"
                        />
                      }
                      label={`Auction Mode: (${
                        property.auction ? "On" : "Off"
                      })`}
                    />
                  </div>
                  <CardFooter className={classes.cardFooter}>
                    <Button
                      round
                      color={!loading ? "primary" : "secondary"}
                      onClick={handleProceed}
                      style={{ marginLeft: "auto" }}
                    >
                      List NFT
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
