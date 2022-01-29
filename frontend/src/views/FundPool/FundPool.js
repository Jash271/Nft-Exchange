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
    // Integration - Page: Fund Pool (Mutual Funds) | Path: '/invest'
  }, []);
  return (
    <div>
      <Parallax filter image={require("assets/img/fundpool.jpg").default}>
        <div className={classes.container} align="center">
          <h1 align="center" style={{ fontWeight: "700" }}>
            Invest
          </h1>
          <GridContainer>
            <GridItem xs={12} sm={12} md={12}>
              <h4 style={{ paddingLeft: "10vw", paddingRight: "10vw" }}>
                Get started in your journey of investing in NFTs led by our team
                of experts in this domain who will ensure that you get the best
                return on your investment.
              </h4>
              <br />
              <Button color="info" size="lg" href="#invest">
                <i className="fas fa-building" style={{ marginRight: 15 }} />
                Invest
              </Button>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          {/* <ProductSection /> */}
          <TeamSection />
          <hr width="60%" style={{ marginLeft: "20%", height: 1 }} />
          <WorkSection />
        </div>
      </div>
    </div>
  );
}
