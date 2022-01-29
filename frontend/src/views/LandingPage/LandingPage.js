import React, { useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Parallax from "components/Parallax/Parallax.js";

import styles from "assets/jss/material-kit-react/views/landingPage.js";

// Sections for this page
import ProductSection from "./Sections/ProductSection.js";
import TeamSection from "./Sections/TeamSection.js";
import WorkSection from "./Sections/WorkSection.js";

const useStyles = makeStyles(styles);

export default function LandingPage() {
  const classes = useStyles();
  useEffect(() => {
    // Integration - Page: Homepage | Path: '/'
  }, []);
  return (
    <div>
      <Parallax filter image={require("assets/img/landing-bg.jpg").default}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={6}>
              <h1 className={classes.title}>
                Buy, Sell <br />
                and Auction <br /> your NFTs
              </h1>
              <h4>
                List out your NFTs powered by our decentralized exchange system
                that runs on blockchain technology to ensure transparency and
                security.
              </h4>
              <br />
              <Button color="info" size="lg" href="/marketplace">
                <i className="fas fa-building" style={{ marginRight: 15 }} />
                Explore Marketplace
              </Button>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <ProductSection />
          <hr width="60%" style={{ marginLeft: "20%", height: 1 }} />
          {/* <TeamSection /> */}
          <WorkSection />
        </div>
      </div>
    </div>
  );
}
