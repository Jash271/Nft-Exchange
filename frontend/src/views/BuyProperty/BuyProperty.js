import React, { useEffect, useState } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

// core components
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import styles from "assets/jss/material-kit-react/views/portfolioPage.js";
import { cardTitle } from "assets/jss/material-kit-react.js";
import nft from "../../Ethereum/nft.js";
var axios = require("axios");

styles.cardTitle = cardTitle;
const useStyles = makeStyles(styles);

export default function BuyProperty(props) {
  const { id } = props.match.params;
  const [instantBuyOpen, setInstantBuyOpen] = useState(false);
  const [scheduleVisitOpen, setScheduleVisitOpen] = useState(false);
  const [bidOpen, setBidOpen] = useState(false);
  const [bid, setBid] = useState("");
  const [appointment, setAppointment] = useState("");
  const [error, setError] = useState({
    bid: "",
    visit: "",
  });
  const handleClose = () => {
    setInstantBuyOpen(false);
    setScheduleVisitOpen(false);
    setBidOpen(false);
  };
  const classes = useStyles();
  const [property, setProperty] = useState();
  const getData = async () => {
    const auction = id.includes("auction");
    if (auction) {
      const a_id = id.slice(id.indexOf("=") + 1);
      var data = JSON.stringify({
        query: `query MyQuery {
  Auction(where: {active: {_eq: true}, a_id: {_eq: "${a_id}"}}) {
    base_price
    end_time
    instant_price
    nft_id
    start_time
    auction_bids {
      a_id
      bid_price
      bidder_addr
      user_verification {
        bidder_addr
      }
      id
    }
    a_id
    active
  }
}`,
        variables: {},
      });

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
        .then(async (response) => {
          console.log(response);
          const res = await nft.methods
            .nftDetails(response.data.data.Auction[0].nft_id)
            .call();
          const data = await axios.get(res.ipfsHash);
          setProperty({
            name: data.data.name,
            a_id: response.data.data.Auction[0].a_id,
            price: response.data.data.Auction[0].base_price,
            instantPrice: response.data.data.Auction[0].instant_price,
            nft_id: response.data.data.Auction[0].nft_id,
            startTime: response.data.data.Auction[0].start_time,
            endTime: response.data.data.Auction[0].end_time,
            image: data.data.image,
            ipfsHash: res.ipfsHash,
            description: data.data.description,
            auction: true,
            bids: response.data.data.Auction[0].auction_bids,
            // bids: [
            //   { id: 7, price: "80000", time: "Few minutes ago" },
            //   { id: 6, price: "70000", time: "Few hours ago" },
            //   { id: 5, price: "60000", time: "A day ago" },
            //   { id: 4, price: "50000", time: "Few days ago" },
            // ],
          });
          setBid(
            parseFloat(
              response.data.data.Auction[0].auction_bids[
                auction_bids.length - 1
              ]?.price
            ) +
              parseFloat(response.data.data.Auction[0].price) * 0.0025
          );
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      data = JSON.stringify({
        query: `query FetchListings {
      nft_listing(where: {cat: {_eq: "sell"}, id: {_eq: "${id}"}}) {
        cat
        id
        nft_id
        on_sell
        price
      }
    }`,
        variables: {},
      });

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
        .then(async (response) => {
          const res = await nft.methods
            .nftDetails(response.data.data.nft_listing[0].nft_id)
            .call();
          const data = await axios.get(res.ipfsHash);
          setProperty({
            id: response.data.data.nft_listing[0].id,
            price: response.data.data.nft_listing[0].price,
            nft_id: response.data.data.nft_listing[0].nft_id,
            auction: false,
            image: data.data.image,
            name: data.data.name,
            description: data.data.description,
            ipfsHash: res.ipfsHash,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);

  const saveBid = () => {
    if (
      parseFloat(bid) <
      Math.max(parseFloat(property.price), parseFloat(property.bids[0].price))
    ) {
      setError({
        ...error,
        bid: "Bid must be greater than current bid / starting price",
      });
    } else {
      setError({
        ...error,
        bid: "",
      });
      var data = JSON.stringify({
        query: `mutation MyMutation {
          update_nft_listing(where: {id: {_eq: "${
            id.includes("auction") ? id.slice(id.indexOf("=") + 1) : id
          }"}}, _set: {on_sell: false}) {
            affected_rows
          }
        }`,
        variables: {},
      });

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
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const saveAppointment = () => {
    console.log(appointment);
    if (!appointment) {
      setError({
        ...error,
        visit: "Please enter a valid appointment date and time",
      });
    } else {
      setError({
        ...error,
        visit: "",
      });
    }
  };
  if (property) {
    return (
      <div>
        <div
          className={classNames(classes.main, classes.mainRaisedHigh)}
          style={{ marginTop: 10 }}
        >
          <div>
            <div style={{ paddingTop: 20 }}>
              <Dialog
                open={instantBuyOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  Purchase {property.name}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Are you sure you want to buy this property at{" "}
                    <b>
                      <i className="fab fa-ethereum"></i>{" "}
                      {property.auction
                        ? property.instantPrice
                        : property.price}
                    </b>
                    ?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setInstantBuyOpen(false)}
                    color="danger"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleClose} color="primary" autoFocus>
                    Buy
                  </Button>
                </DialogActions>
              </Dialog>
              <Dialog
                open={bidOpen}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Place your bid</DialogTitle>
                <DialogContent>
                  {property.auction && (
                    <DialogContentText>
                      The current highest bid is :{" "}
                      <b>
                        {" "}
                        <i className="fab fa-ethereum"></i>{" "}
                        {property.bids[0]?.price}{" "}
                      </b>{" "}
                      <br />
                      To proceed placing your bid, please enter your bidding
                      amount below:
                    </DialogContentText>
                  )}
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Bidding Price (ETH)"
                    type="number"
                    value={bid}
                    onChange={(e) => {
                      setBid(e.target.value);
                      setError({
                        ...error,
                        bid: "",
                      });
                    }}
                    placeholder="Price"
                    error={!!error.bid}
                    helperText={error.bid}
                    fullWidth
                  />{" "}
                  <br />
                  <span style={{ fontSize: 12 }}>
                    Note: Bidders are required to pay a fully refundable deposit
                    of <i className="fab fa-ethereum"></i>{" "}
                    {property.price * 0.0025} (2.5% of Property Price) to place
                    a bid. This amount will be refunded to you in whole incase
                    you are not the highest bidder. If you wish to purchase the
                    NFT then this amount will be deducted from your total bill.
                  </span>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setBidOpen(false)} color="danger">
                    Cancel
                  </Button>
                  <Button onClick={saveBid} color="primary">
                    Bid
                  </Button>
                </DialogActions>
              </Dialog>

              {/* <Dialog
              open={scheduleVisitOpen}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">Schedule a visit</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  The visitation hours for this property are{" "}
                  <b>{property.visitingHours} </b>
                  <br />
                  Please enter the date and time you would like to visit this
                  property:
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Appointment Time"
                  type="datetime-local"
                  value={appointment}
                  onChange={(e) => {
                    setAppointment(e.target.value);
                    setError({
                      ...error,
                      visit: "",
                    });
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Eg: Monday, 4pm"
                  fullWidth
                  error={!!error.visit}
                  helperText={error.visit}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="danger">
                  Cancel
                </Button>
                <Button onClick={saveAppointment} color="primary">
                  Schedule
                </Button>
              </DialogActions>
            </Dialog> */}
              {/* <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={6}>
                <div align="center" style={{ color: "#7F7F7F" }}>
                  <h3 className={classes.title}>{property.name}</h3>
                </div>
              </GridItem>
            </GridContainer> */}
              <div
                style={{
                  padding: 20,
                }}
              >
                <GridContainer justify="center">
                  <GridItem
                    xs={12}
                    sm={12}
                    md={4}
                    className={classes.navWrapper}
                    style={{ borderRight: "1px solid #ccc" }}
                  >
                    <img
                      src={property.image}
                      alt={property.name}
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                      }}
                    />
                    <div
                      style={{
                        maxHeight: 70,
                        marginTop: 10,
                        overflowY: "scroll",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {property.images?.map((photo) => {
                        return (
                          <img
                            src={photo}
                            key={photo}
                            alt={property.name}
                            style={{
                              maxHeight: 50,
                              marginRight: 5,
                              maxWidth: "100%",
                            }}
                          />
                        );
                      })}
                    </div>
                  </GridItem>
                  <GridItem
                    xs={12}
                    sm={12}
                    md={property.auction ? 5 : 8}
                    className={classes.navWrapper}
                    style={{ borderRight: "1px solid #ccc" }}
                  >
                    <div align="left">
                      <h3
                        className={classes.title}
                        style={{ marginTop: 0, marginBottom: 2 }}
                      >
                        {property.name}
                      </h3>
                      <hr
                        style={{
                          width: "40%",
                          height: "1px",
                          backgroundColor: "#ccc",
                        }}
                        align="left"
                      />
                      <div style={{ fontSize: 14 }}>
                        {property.description}
                        <br />
                        Ends on: {property.endTime}
                        <hr
                          style={{
                            width: "40%",
                            height: "1px",
                            backgroundColor: "#ccc",
                          }}
                          align="left"
                        />
                      </div>
                      {property.auction ? (
                        <div>
                          <h4>
                            Bid:{" "}
                            <span style={{ fontWeight: "600" }}>
                              {" "}
                              <i className="fab fa-ethereum"></i>{" "}
                              {property.price}{" "}
                            </span>
                            {property.instantPrice && (
                              <>
                                <span
                                  style={{ marginRight: 10, marginLeft: 10 }}
                                >
                                  {" "}
                                  |{" "}
                                </span>{" "}
                                Instant buy:{" "}
                                <span style={{ fontWeight: "600" }}>
                                  <i className="fab fa-ethereum"></i>{" "}
                                  {property.instantPrice}
                                </span>
                              </>
                            )}
                          </h4>
                        </div>
                      ) : (
                        <h3 style={{ fontWeight: "600" }}>
                          {" "}
                          <i className="fab fa-ethereum"></i> {property.price}
                        </h3>
                      )}
                      {/* <Button
                      color="info"
                      onClick={() => setScheduleVisitOpen(true)}
                      style={{ marginRight: 10, marginLeft: 0 }}
                    >
                      Schedule Visit
                    </Button> */}
                      <Button
                        color="primary"
                        onClick={() => {
                          property.auction
                            ? setBidOpen(true)
                            : setInstantBuyOpen(true);
                        }}
                        style={{
                          marginRight: property.instantPrice ? 10 : "auto",
                        }}
                      >
                        {property.auction ? "Bid" : "Buy"}
                      </Button>
                      {property.instantPrice && (
                        <Button
                          color="success"
                          onClick={() => setInstantBuyOpen(true)}
                          style={{ marginRight: "auto" }}
                        >
                          Instant Buy
                        </Button>
                      )}
                    </div>
                  </GridItem>
                  {property.auction && (
                    <GridItem
                      xs={12}
                      sm={12}
                      md={3}
                      className={classes.navWrapper}
                    >
                      <div align="left">
                        <h3 style={{ marginTop: -5 }}>Bidding History</h3>
                        <hr
                          style={{
                            width: "70%",
                            height: "1px",
                            backgroundColor: "#ccc",
                          }}
                          align="left"
                        />
                        {property.bids.map((item) => {
                          return (
                            <div key={item.id} style={{ paddingRight: 120 }}>
                              <p>
                                <span style={{ fontWeight: "600" }}>
                                  {item.id === 5 ? "You" : "User"} #
                                  {item.bidder_addr.slice(
                                    item.bidder_addr.length - 4
                                  )}
                                </span>
                                <span style={{ float: "right" }}>
                                  <i className="fab fa-ethereum"></i>{" "}
                                  {item.bid_price}
                                </span>{" "}
                                <br />
                                {item.time}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </GridItem>
                  )}
                </GridContainer>
                {/* <iframe
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src="https://maps.google.com/?q=20.5937,78.9629&output=embed"
                ></iframe> */}
              </div>
              <br />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <h2 align="center" style={{ marginTop: "20vh", marginBottom: "50vh" }}>
        Loading...
      </h2>
    );
  }
}
