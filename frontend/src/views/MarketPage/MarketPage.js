import React, { useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";
// @material-ui/icons
import SearchIcon from "@material-ui/icons/Search";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Parallax from "components/Parallax/Parallax.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import { InputAdornment } from "@material-ui/core";

import styles from "assets/jss/material-kit-react/views/portfolioPage.js";
import { cardTitle } from "assets/jss/material-kit-react.js";

import nft from "../../Ethereum/nft.js";
const axios = require("axios");
import { useHistory } from "react-router-dom";

styles.cardTitle = cardTitle;
const useStyles = makeStyles(styles);

export default function MarketPage() {
  const classes = useStyles();
  const history = useHistory();
  const [search, setSearch] = React.useState("");
  const [auction, setAuction] = React.useState(false);
  const [listings, setListings] = React.useState([]);
  const [filteredListings, setFilteredListings] = React.useState([]);
  const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);
  const handleSearch = (val) => {
    setSearch(val);
    setFilteredListings(
      listings.filter((listing) =>
        auction ? listing.nft_id.includes(val) : listing.id.includes(val)
      )
    );
  };

  const [nftData, setNftData] = React.useState({});
  const getIpfs = async (nftId) => {
    try {
      if (!nftData[nftId]) {
        const res = await nft.methods.nftDetails(nftId).call();
        const data = await axios.get(res.ipfsHash);
        setNftData((prev) => ({ ...prev, [nftId]: data.data }));
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getData = async (auctionType = false) => {
    var data = {};
    var axios = require("axios");
    if (!auctionType) {
      data = JSON.stringify({
        query: `query FetchListings {
      nft_listing(where: {cat: {_eq: "sell"}}) {
        cat
        id
        nft_id
        on_sell
        price
      }
    }`,
        variables: {},
      });
    } else {
      data = JSON.stringify({
        query: `query MyQuery {
        Auction(where: {active: {_eq: true}}) {
          base_price
          end_time
          instant_price
          nft_id
          a_id
          start_time
        }
      }`,
        variables: {},
      });
    }

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
        if (auctionType) {
          setListings(response.data.data.Auction);
          setFilteredListings(response.data.data.Auction);
          response.data.data.Auction.map(async (listing) => {
            await getIpfs(listing.nft_id);
          });
          setSearch("");
        } else {
          setListings(response.data.data.nft_listing);
          setFilteredListings(response.data.data.nft_listing);
          response.data.data.nft_listing.map(async (listing) => {
            await getIpfs(listing.nft_id);
          });
          setSearch("");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    // Integration - Page: Marketplace | Path: '/market'
    getData();
  }, []);
  const handleCheck = (value) => {
    setAuction(value);
    getData(value);
  };
  return (
    <div>
      <Parallax
        small
        filter
        image={require("assets/img/marketplace.jpg").default}
      />
      <div className={classNames(classes.main, classes.mainRaisedHigh)}>
        <div>
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={6}>
                <div align="center" style={{ color: "#7F7F7F" }}>
                  <h3 className={classes.title}>Explore Listings</h3>
                </div>
              </GridItem>
            </GridContainer>
            <div className={classes.description} style={{ marginTop: -10 }}>
              <p>Find all properties for sale in your area.</p>
            </div>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={8} className={classes.navWrapper}>
                <CustomInput
                  id="search"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  inputProps={{
                    placeholder: "Search NFT",
                    name: "search",
                    value: search,
                    onChange: (event) => handleSearch(event.target.value),
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </GridItem>
            </GridContainer>
            <GridContainer>
              <GridItem
                xs={12}
                sm={12}
                md={8}
                style={{ marginTop: -45, paddingLeft: "13vw" }}
              >
                <Switch
                  checked={auction}
                  onChange={(val) => handleCheck(val.target.checked)}
                  name="Auction"
                  inputProps={{ "aria-label": "secondary checkbox" }}
                />
                Auction:
              </GridItem>
            </GridContainer>
            <GridContainer justify="center">
              {/* {[
                {
                  id: 1,
                  name: "NFT Name",
                  basePrice: "570",
                  currentPrice: "570",
                  image: "https://source.unsplash.com/random",
                  address:
                    "Building Name, Address Street Name, Address City, Address State.",
                  visitngHours: "Monday - Friday: 9am - 5pm",
                  city: "City Name",
                  endsIn: "1 hour",
                },
              ]*/}
              {filteredListings.map((prop) => {
                return (
                  <GridItem xs={12} sm={12} md={4} key={prop.id || prop.a_id}>
                    <Card
                      onClick={() =>
                        history.push(
                          !auction
                            ? `/buy/${prop.id}`
                            : `/buy/auction=${prop.a_id}`
                        )
                      }
                      key={prop.id}
                    >
                      {prop.end_time && (
                        <CardHeader style={{ zIndex: 999 }} color="warning">
                          <i className="far fa-clock"></i> Auction Ends on{" "}
                          {prop.end_time}
                        </CardHeader>
                      )}
                      <img
                        src={nftData[prop.nft_id]?.image}
                        alt={nftData[prop.nft_id]?.name}
                        height={250}
                        width="auto"
                        className={navImageClasses}
                        style={{ marginTop: -20 }}
                      />
                      <div
                        style={{
                          backgroundColor: "#000",
                          opacity: 0.5,
                          height: 68,
                          marginTop: -100,
                          color: "white",
                        }}
                      ></div>
                      <div
                        align="left"
                        style={{ padding: 15, marginTop: -85, zIndex: 999 }}
                      >
                        <h4
                          className={classes.cardTitle}
                          style={{ color: "white", marginBottom: 0 }}
                        >
                          {nftData[prop.nft_id]?.name} #{prop.nft_id}
                        </h4>
                        <div
                          align="right"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            color: "white",
                            marginBottom: 15,
                          }}
                        >
                          <div style={{ flex: 1 }} align="left">
                            By UserXYZ
                          </div>
                          <div
                            style={{ flex: 1, fontWeight: "700", fontSize: 18 }}
                          >
                            <i className="fab fa-ethereum"></i>{" "}
                            {!auction
                              ? prop.price
                              : prop.currentPrice || prop.base_price}{" "}
                          </div>
                        </div>
                        {nftData[prop.nft_id]?.description}
                        {prop.start_time && (
                          <div>Listed On: {prop.start_time}</div>
                        )}
                        {prop.instant_price && (
                          <div>Instant Buy: {prop.instant_price}</div>
                        )}
                      </div>
                    </Card>
                  </GridItem>
                );
              })}
            </GridContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
