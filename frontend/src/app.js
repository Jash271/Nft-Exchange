import React, { useEffect } from "react";
import { createBrowserHistory } from "history";
import {
  Router,
  Route,
  Switch,
  Link,
  Redirect,
  useLocation,
} from "react-router-dom";

import "assets/scss/material-kit-react.scss?v=1.10.0";

// pages for this product
import Footer from "components/Footer/Footer";
import Header from "components/Header/Header.js";
import Components from "views/Components/Components.js";
import LandingPage from "views/LandingPage/LandingPage.js";
import FundPoolPage from "views/FundPool/FundPool.js";
import PortfolioPage from "views/PortfolioPage/PortfolioPage.js";
import MarketPage from "views/MarketPage/MarketPage.js";
import AddListingPage from "views/AddListingPage/AddListingPage.js";
import AddPropertyPage from "views/AddPropertyPage/AddPropertyPage.js";
import BuyProperty from "views/BuyProperty/BuyProperty.js";
import LoginPage from "views/LoginPage/LoginPage.js";
import SignupPage from "views/SignupPage/SignupPage.js";
import HeaderLinks from "components/Header/HeaderLinks.js";

var hist = createBrowserHistory();
const dashboardRoutes = [];

const invalidRoute = () => {
  return (
    <>
      <h1 style={{ marginTop: "43vh" }} align="center">
        {" "}
        404 Not Found{" "}
      </h1>
      <p style={{ marginBottom: "43vh" }} align="center">
        Go back to <Link to="/">homepage</Link>
      </p>
    </>
  );
};

function ProtectedRoute({ component: Component, ...restOfProps }) {
  const isAuthenticated = localStorage.getItem("token");

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

function GuestRoute({ component: Component, ...restOfProps }) {
  const isAuthenticated = !localStorage.getItem("token");

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
}

const ScrollToTop = (props) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (pathname.indexOf("buy") > -1) {
      props.setNavStyle("white");
    } else {
      props.setNavStyle("transparent");
    }
  }, [pathname]);

  return null;
};

export default function App() {
  const [navStyle, setNavStyle] = React.useState(
    window.location.href.indexOf("buy") > -1 ? "white" : "transparent"
  );
  return (
    <Router history={hist}>
      <ScrollToTop setNavStyle={setNavStyle} />
      {navStyle === "white" && <div style={{ height: 60 }} />}
      <Header
        color={navStyle}
        routes={dashboardRoutes}
        brand="NFT Exchange"
        rightLinks={<HeaderLinks />}
        fixed
        changeColorOnScroll={{
          height: 150,
          color: "white",
        }}
      />
      <Switch>
        {/* <Route exact path="/components" component={Components} /> */}
        <Route exact path="/" component={LandingPage} />
        <ProtectedRoute exact path="/portfolio" component={PortfolioPage} />
        <ProtectedRoute exact path="/market" component={MarketPage} />
        <ProtectedRoute exact path="/invest" component={FundPoolPage} />
        <ProtectedRoute exact path="/sell/:id" component={AddListingPage} />
        <ProtectedRoute exact path="/nft/new" component={AddPropertyPage} />

        <GuestRoute exact path="/login" component={LoginPage} />
        <GuestRoute exact path="/signup" component={SignupPage} />
        <Route path="/buy/:id" render={(props) => <BuyProperty {...props} />} />
        <Route component={invalidRoute} />
      </Switch>
      <Footer />
    </Router>
  );
}
