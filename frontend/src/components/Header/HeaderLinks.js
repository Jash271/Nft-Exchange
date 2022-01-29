/*eslint-disable*/
import React, { useState, useEffect } from "react";
// react components for routing our app without refresh
import { Link } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";

// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";

import { useMoralis } from "react-moralis";

const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const [addr, Setaddr] = useState(localStorage.getItem("token"));

  const classes = useStyles();
  const {
    Moralis,
    authenticate,
    isAuthenticated,
    user,
    logout,
    isAuthenticating,
  } = useMoralis();

  useEffect(() => {
    if (isAuthenticated && !addr && !isAuthenticating) {
      console.log(user.get("ethAddress"));
      localStorage.setItem("token", user.get("ethAddress"));
      Setaddr(user.get("ethAddress"));
    }

    //eslint-disable-next-line
  }, [isAuthenticated, addr]);

  return (
    <List className={classes.list}>
      {/*<ListItem className={classes.listItem}>
        <CustomDropdown
          noLiPadding
          buttonText="Components"
          buttonProps={{
            className: classes.navLink,
            color: "transparent",
          }}
          buttonIcon={Apps}
          dropdownList={[
            <Link to="/" className={classes.dropdownLink}>
              All components
            </Link>,
            <a
              href="https://creativetimofficial.github.io/material-kit-react/#/documentation?ref=mkr-navbar"
              target="_blank"
              className={classes.dropdownLink}
            >
              Documentation
            </a>,
          ]}
        />
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          href="https://www.creative-tim.com/product/material-kit-react?ref=mkr-navbar"
          color="transparent"
          target="_blank"
          className={classes.navLink}
        >
          <CloudDownload className={classes.icons} /> Download
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Tooltip title="Delete">
          <IconButton aria-label="Delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip
          id="instagram-twitter"
          title="Follow us on twitter"
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            href="https://twitter.com/CreativeTim?ref=creativetim"
            target="_blank"
            color="transparent"
            className={classes.navLink}
          >
            <i className={classes.socialIcons + " fab fa-twitter"} />
          </Button>
        </Tooltip> 

        </ListItem>*/}
      {localStorage.getItem("token") ? (
        <>
          {[
            // {name: "Sell", link: "/sell"},
            { name: "Invest", link: "/invest" },
            { name: "Market", link: "/market" },
            { name: "Portfolio", link: "/portfolio" },
          ].map((item) => (
            <ListItem className={classes.listItem} key={item.name}>
              <Link to={item.link} className={classes.navLink}>
                {item.name}
              </Link>
            </ListItem>
          ))}
          <ListItem className={classes.listItem}>
            <a
              href="/"
              onClick={() => {
                localStorage.removeItem("token");
                logout();
              }}
              className={classes.navLink}
            >
              Logout
            </a>
          </ListItem>
        </>
      ) : (
        <ListItem className={classes.listItem} onClick={() => authenticate()}>
          <div onClick={() => authenticate()}>
            {/* <Link to="/login" className={classes.navLink}> */}
            Connect Wallet
            {/* </Link> */}
          </div>
        </ListItem>
      )}
    </List>
  );
}
