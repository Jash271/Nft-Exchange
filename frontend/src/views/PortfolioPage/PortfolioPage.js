import React, { useState, useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
// @material-ui/icons
import Home from "@material-ui/icons/Home";
import HomeWork from "@material-ui/icons/HomeWork";
import Business from "@material-ui/icons/Business";
import AddShoppingCart from "@material-ui/icons/AddShoppingCart";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
// core components
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import NavPills from "components/NavPills/NavPills.js";
import Parallax from "components/Parallax/Parallax.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import styles from "assets/jss/material-kit-react/views/portfolioPage.js";
import { cardTitle } from "assets/jss/material-kit-react.js";

import { Link } from "react-router-dom";

import nft from "../../Ethereum/nft.js";
import web3 from "../../Ethereum/web3";
import axios from "axios";

styles.cardTitle = cardTitle;
const useStyles = makeStyles(styles);

export default function PortfolioPage() {
  const classes = useStyles();
  // const user = JSON.parse(localStorage.getItem("profile"));
  const imageClasses = classNames(
    classes.imgRaised,
    classes.imgRoundedCircle,
    classes.imgFluid
  );
  const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);
  const [openMortgage, setOpenMortgage] = useState(false);
  const [openPaymonthly, setOpenPayMonthly] = useState(false);
  const [payMortgage, setPayMortgage] = useState({
    amount: 0,
    id: "",
  });
  const address = localStorage.getItem("token");
  const [mortgageDetails, setMortgageDetails] = useState({
    id: "",
    loanAmount: 1,
    timePeriod: 0,
  });
  const [nfts, setNfts] = useState([]);
  const [listings, setListings] = useState([]);
  const [mortgages, setMortgages] = useState([]);

  const handleCloseMortgage = () => {
    setOpenMortgage(false);
    MortageNFT();
  };

  const handleChangePayAmount = (e) => {
    setPayMortgage({ ...payMortgage, amount: e.target.value });
  };

  const handleClosePayMonthly = () => {
    setOpenPayMonthly(false);
    PayInstallment();
  };

  useEffect(() => {
    getData();
    // Integration - Page: Profile Page | Path: '/portfolio'
  }, []);

  const PayInstallment = async () => {
    let final_amount = await web3.utils.toWei(`${payMortgage.amount}`, "ether");
    // console.log(final_amount, payMortgage);
    try {
      const accounts = await web3.eth.getAccounts();
      await nft.methods
        .payInstallment(final_amount, parseInt(payMortgage.id))
        .send({ from: accounts[0], value: final_amount });
    } catch (error) {
      alert(error.message);
      return;
    }
    window.location.reload();
  };

  const getData = async () => {
    let temp = [];
    let temp1 = [];
    try {
      var contract_nfts = await nft.methods
        .getNFTs("0x0C15e13B433e4175B40AaAa2eb53EEC8E4e6941d")
        .call();
      const response = await nft.methods.getNFTs(address).call();
      console.log(response, contract_nfts);

      for (let data of response) {
        let info = await axios.get(`${data.ipfsHash}`);
        // console.log(info.data, c);
        let resp = await info.data;
        resp = { ...resp, ...data };
        temp.push(resp);
      }

      for (let val of contract_nfts) {
        const res = await fetch(val.ipfsHash);
        let resp = await res.json();
        console.log(resp);
        resp = { ...resp, ...val };
        temp1.push(resp);
      }
    } catch (error) {
      alert(error.message);
      return;
    }
    setNfts(temp);
    setListings(temp.filter((data) => data.fixedPrice > 0));
    setMortgages(
      temp1.filter((data) => {
        return data.beforeMortgageowner.toLowerCase() === address.toLowerCase();
      })
    );

    console.log(nfts, listings, mortgages);
  };

  const MortageNFT = async () => {
    // final_amount in eth is loan amount with
    // interest which should be multiplied by 10^18 before function call
    let final_amount =
      (mortgageDetails.loanAmount * 12 * (mortgageDetails.timePeriod / 12)) /
      100;
    let wei_amount = await web3.utils.toWei(
      `${parseFloat(final_amount + mortgageDetails.loanAmount)}`,
      "ether"
    );
    console.log(final_amount, mortgageDetails);
    try {
      await nft.methods
        .mortgageNFT(
          parseInt(mortgageDetails.id),
          wei_amount,
          address,
          "0xCB45896c0a3361fBCdDfa714988E0c5717367cFA"
        )
        .send({ from: address });
    } catch (error) {
      alert(error.message);
      return;
    }
  };

  useEffect(() => {}, []);

  const handleChange = (event) => {
    setMortgageDetails({
      ...mortgageDetails,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div>
      <Parallax
        small
        filter
        image={require("assets/img/profile-bg.jpg").default}
      />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div>
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={6}>
                <div className={classes.profile}>
                  <div>
                    <img
                      src="https://uploads-ssl.webflow.com/5d828b424b5d285a3d43debb/5d828b424b5d28d55b43ded0_Testimonial-5.jpg"
                      className={"fas fa-user"}
                      className={imageClasses}
                    />
                  </div>
                </div>
                <div align="center" className={classes.name}>
                  <h3 className={classes.title}>Jash Shah</h3>
                </div>
                <div
                  align="center"
                  style={{ marginTop: -10, color: "#7F7F7F" }}
                >
                  <h5>shahjash@gmail.com</h5>
                </div>
              </GridItem>
            </GridContainer>
            <div className={classes.description}>
              <p>Know more about your NFT listings and purchases below.</p>
            </div>
            <div
              align="center"
              style={{ marginLeft: "20%", marginRight: "20%", marginTop: 35 }}
            >
              <Link to="/nft/new">
                <Button color="primary" fullWidth round>
                  Add New NFT
                </Button>
              </Link>
            </div>
            <Dialog
              open={openMortgage}
              onClose={handleCloseMortgage}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Mortgage NFT?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you wish to Mortgage your NFT? This will
                  temporarily transfer the ownership of your asset to our
                  partnered bank and the NFT might be auto-sold at fixed
                  stoploss.
                  <br />
                  <br />
                  <b>Estimated NFT Valuation = 1 Ether </b>
                  <br />
                  <CustomInput
                    labelText="Time Duration"
                    id="timePeriod"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "timePeriod",
                      value: mortgageDetails.timePeriod,
                      onChange: handleChange,
                      placeholder: "Enter Time duration in months",
                      // startAdornment: (
                      //   <InputAdornment position="start">
                      //     <HomeWorkIcon className={classes.inputIconsColor} />
                      //   </InputAdornment>
                      // ),
                    }}
                  />
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseMortgage} color="danger">
                  Cancel
                </Button>
                <Button onClick={handleCloseMortgage} color="primary" autoFocus>
                  Accept
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={openPaymonthly}
              onClose={handleClosePayMonthly}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Pay For Your Mortgaged NFT?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Payback your loan amount to get your mortgaged NFT back
                  <br />
                  <br />
                  <CustomInput
                    labelText="Pay Amount"
                    id="payMortgage"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      name: "payMortgage",
                      value: payMortgage.amount,
                      onChange: handleChangePayAmount,
                      placeholder: "Enter amount to be paid in ETH",
                      // startAdornment: (
                      //   <InputAdornment position="start">
                      //     <HomeWorkIcon className={classes.inputIconsColor} />
                      //   </InputAdornment>
                      // ),
                    }}
                  />
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClosePayMonthly}
                  color="primary"
                  autoFocus
                >
                  Pay
                </Button>
              </DialogActions>
            </Dialog>

            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={8} className={classes.navWrapper}>
                <NavPills
                  alignCenter
                  color="primary"
                  tabs={[
                    {
                      tabButton: "NFTs",
                      tabIcon: Home,
                      tabContent: (
                        <GridContainer justify="center">
                          {nfts?.map((prop, key) => {
                            return (
                              <Card key={key}>
                                {/* {!prop.verified && (
                                  <CardHeader color="warning">
                                    Verification under process
                                  </CardHeader>
                                )} */}
                                <CardBody>
                                  <GridContainer>
                                    <GridItem xs={12} sm={12} md={6}>
                                      <div align="left">
                                        <h4 className={classes.cardTitle}>
                                          {prop.name}
                                        </h4>
                                        <br />
                                        <p>{prop.description}</p>

                                        <Link to={`/sell/${prop.id}`}>
                                          <Button color="primary">
                                            <i
                                              className="fas fa-hand-holding-usd fa-xs"
                                              style={{ marginRight: 5 }}
                                            />
                                            List for Sale
                                          </Button>
                                        </Link>
                                        <Button
                                          color="info"
                                          onClick={() => {
                                            setMortgageDetails({
                                              ...mortgageDetails,
                                              id: prop.id,
                                            });
                                            setOpenMortgage(true);
                                          }}
                                        >
                                          <i
                                            className="fas fa-hand-holding-usd fa-xs"
                                            style={{ marginRight: 5 }}
                                          />
                                          Mortgage NFT
                                        </Button>
                                      </div>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6}>
                                      <img
                                        src={prop.image}
                                        alt={prop.name}
                                        height={250}
                                        width="auto"
                                        className={navImageClasses}
                                      />
                                    </GridItem>
                                  </GridContainer>
                                </CardBody>
                              </Card>
                            );
                          })}
                        </GridContainer>
                      ),
                    },
                    {
                      tabButton: "Listings",
                      tabIcon: HomeWork,
                      tabContent: (
                        <GridContainer justify="center">
                          {
                            /* {[
                            {
                              name: "NFT Name",
                              basePrice: "570",
                              currentPrice: "570",
                              image: "https://source.unsplash.com/random",
                              address:
                                "Building Name, Address Street Name, Address City, Address State.",
                              endsIn: "1 hour",
                              verified: true,
                            },
                            {
                              name: "NFT Name 2",
                              basePrice: "570",
                              currentPrice: "570",
                              image: "https://source.unsplash.com/random",
                              address:
                                "Building Name, Address Street Name, Address City, Address State.",
                              verified: false,
                            },
                          ] */
                            listings.map((prop, key) => {
                              return (
                                <Card key={key}>
                                  {/* {prop.endsIn && (
                                  <CardHeader color="warning">
                                    Auction Ends in {prop.endsIn}
                                  </CardHeader>
                                )} */}
                                  <CardBody>
                                    <GridContainer>
                                      <GridItem xs={12} sm={12} md={6}>
                                        <div align="left">
                                          <h4 className={classes.cardTitle}>
                                            {prop.name}
                                          </h4>
                                          <div>
                                            Selling Price in{" "}
                                            <i className="fab fa-ethereum"></i>{" "}
                                            {parseInt(prop.fixedPrice) /
                                              Math.pow(10, 18)}{" "}
                                          </div>
                                          <div>
                                            USD Equivalent :{" "}
                                            {(parseInt(prop.fixedPrice) /
                                              Math.pow(10, 18)) *
                                              2545.34}{" "}
                                            $
                                          </div>
                                          <br />
                                          <p>{prop.name}</p>
                                          <Button color="info">
                                            <i
                                              className="fas fa-edit fa-xs"
                                              style={{ marginRight: 5 }}
                                            />
                                            Edit
                                          </Button>
                                        </div>
                                      </GridItem>
                                      <GridItem xs={12} sm={12} md={6}>
                                        <img
                                          src={prop.image}
                                          alt={prop.name}
                                          height={250}
                                          width="auto"
                                          className={navImageClasses}
                                        />
                                      </GridItem>
                                    </GridContainer>
                                  </CardBody>
                                </Card>
                              );
                            })
                          }
                        </GridContainer>
                      ),
                    },
                    {
                      tabButton: "Ongoing Bids",
                      tabIcon: AddShoppingCart,
                      tabContent: (
                        <GridContainer justify="center">
                          {[
                            {
                              name: "NFT Name",
                              basePrice: "750",
                              currentPrice: "800",
                              image: "https://source.unsplash.com/random",
                              address:
                                "Building Name, Address Street Name, Address City, Address State.",
                              endsIn: "4 days",
                            },
                          ].map((prop, key) => {
                            return (
                              <Card key={key}>
                                {prop.endsIn && (
                                  <CardHeader color="warning">
                                    Auction Ends in {prop.endsIn}
                                  </CardHeader>
                                )}
                                <CardBody>
                                  <GridContainer>
                                    <GridItem xs={12} sm={12} md={6}>
                                      <div align="left">
                                        <h4 className={classes.cardTitle}>
                                          {prop.name}
                                        </h4>
                                        <div>
                                          Starting:{" "}
                                          <i className="fab fa-ethereum"></i>{" "}
                                          {prop.basePrice}{" "}
                                        </div>
                                        <div>
                                          Current:{" "}
                                          <i className="fab fa-ethereum"></i>{" "}
                                          {prop.currentPrice}{" "}
                                        </div>
                                        <br />
                                        <p>{prop.address}</p>
                                        <Button color="primary">
                                          <i
                                            className="fas fa-hand-holding-usd fa-xs"
                                            style={{ marginRight: 10 }}
                                          />{" "}
                                          Bid
                                        </Button>
                                      </div>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6}>
                                      <img
                                        src={prop.image}
                                        alt={prop.name}
                                        height={250}
                                        width="auto"
                                        className={navImageClasses}
                                      />
                                    </GridItem>
                                  </GridContainer>
                                </CardBody>
                              </Card>
                            );
                          })}
                        </GridContainer>
                      ),
                    },
                    {
                      tabButton: "Purchases",
                      tabIcon: Business,
                      tabContent: (
                        <GridContainer justify="center">
                          {[
                            {
                              name: "NFT Name",
                              price: "570",
                              image: "https://source.unsplash.com/random",
                              address:
                                "Building Name, Address Street Name, Address City, Address State.",
                            },
                          ].map((prop, key) => {
                            return (
                              <Card key={key}>
                                <CardBody>
                                  <GridContainer>
                                    <GridItem xs={12} sm={12} md={6}>
                                      <div align="left">
                                        <h4 className={classes.cardTitle}>
                                          {prop.name}
                                        </h4>
                                        <h5>
                                          {" "}
                                          <i className="fab fa-ethereum"></i>{" "}
                                          {prop.price}{" "}
                                        </h5>
                                        <p>{prop.address}</p>
                                        <Button color="info">
                                          <i
                                            className="fas fa-edit fa-xs"
                                            style={{ marginRight: 5 }}
                                          />
                                          Edit
                                        </Button>
                                      </div>
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6}>
                                      <img
                                        src={prop.image}
                                        alt={prop.name}
                                        height={250}
                                        width="auto"
                                        className={navImageClasses}
                                      />
                                    </GridItem>
                                  </GridContainer>
                                </CardBody>
                              </Card>
                            );
                          })}
                        </GridContainer>
                      ),
                    },
                    {
                      tabButton: "Mortgages",
                      tabIcon: AccountBalanceIcon,
                      tabContent: (
                        <GridContainer justify="center">
                          {
                            /* {[
                            {
                              name: "NFT Name",
                              basePrice: "750",
                              currentPrice: "200",
                              image: "https://source.unsplash.com/random",
                              address:
                                "Building Name, Address Street Name, Address City, Address State.",
                              endsIn: "4 days",
                            },
                          ] */
                            mortgages.map((prop, key) => {
                              return (
                                <Card key={key}>
                                  {prop.endsIn && (
                                    <CardHeader color="warning">
                                      Pay next in {prop.endsIn}
                                    </CardHeader>
                                  )}
                                  <CardBody>
                                    <GridContainer>
                                      <GridItem xs={12} sm={12} md={6}>
                                        <div align="left">
                                          <h4 className={classes.cardTitle}>
                                            {prop.name}
                                          </h4>
                                          <div>
                                            Pending Debt in{" "}
                                            <i className="fab fa-ethereum"></i>{" "}
                                            :{" "}
                                            {parseInt(prop.mortgageAmount) /
                                              Math.pow(10, 18)}{" "}
                                          </div>
                                          <div>
                                            USD Equivalent:{" "}
                                            {(parseInt(prop.mortgageAmount) /
                                              Math.pow(10, 18)) *
                                              2545.34}{" "}
                                            $
                                          </div>

                                          <br />
                                          <p>{prop.address}</p>
                                          <Button
                                            color="primary"
                                            onClick={() => {
                                              setOpenPayMonthly(true);
                                              setPayMortgage({
                                                ...payMortgage,
                                                id: prop.id,
                                              });
                                            }}
                                          >
                                            <i
                                              className="fas fa-hand-holding-usd fa-xs"
                                              style={{ marginRight: 10 }}
                                            />{" "}
                                            Pay (Monthly)
                                          </Button>
                                        </div>
                                      </GridItem>
                                      <GridItem xs={12} sm={12} md={6}>
                                        <img
                                          src={prop.image}
                                          alt={prop.name}
                                          height={250}
                                          width="auto"
                                          className={navImageClasses}
                                        />
                                      </GridItem>
                                    </GridContainer>
                                  </CardBody>
                                </Card>
                              );
                            })
                          }
                        </GridContainer>
                      ),
                    },
                  ]}
                />
              </GridItem>
            </GridContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
