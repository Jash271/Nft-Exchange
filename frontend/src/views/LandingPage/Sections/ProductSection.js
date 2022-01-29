import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import VerifiedUser from "@material-ui/icons/VerifiedUser";
import Security from "@material-ui/icons/Security";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import InfoArea from "components/InfoArea/InfoArea.js";

import styles from "assets/jss/material-kit-react/views/landingPageSections/productStyle.js";

const useStyles = makeStyles(styles);

export default function ProductSection() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={8}>
          <h2 className={classes.title}>Not just some other NFT Marketplace</h2>
          <h5 className={classes.description}>
            Unlike the rest, We are a decentralized exchange system that runs on
            blockchain technology to ensure transparency and security and
            provides you the platform to not only buy or sell but also auction
            your NFTs.
          </h5>
        </GridItem>
      </GridContainer>
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="Decentralized"
              description="To respect your privacy, we work on a decentralized model that works on a blockchain."
              icon={AccountTreeIcon}
              iconColor="info"
              vertical
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="Verified Listings"
              description="All listings go through a verification process to ensure they are reliable and legitimate."
              icon={VerifiedUser}
              iconColor="success"
              vertical
            />
          </GridItem>
          <GridItem xs={12} sm={12} md={4}>
            <InfoArea
              title="100% Secure"
              description="All purchases are secure and your information is kept anonymous."
              icon={Security}
              iconColor="success"
              vertical
            />
          </GridItem>
        </GridContainer>
      </div>
    </div>
  );
}
