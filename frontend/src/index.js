import React from "react";
import ReactDOM from "react-dom";

import "assets/scss/material-kit-react.scss?v=1.10.0";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import App from "./app";

import { MoralisProvider } from "react-moralis";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#00308F",
    },
    secondary: {
      main: "#f9a602",
    },
  },
});

const serverUrl = "https://iobj4lqidchf.usemoralis.com:2053/server";
const appId = "nhWI4OgtNMsJDts973jpnoxW7jY6mmc28Otu4leT";

ReactDOM.render(
  <MoralisProvider appId={appId} serverUrl={serverUrl}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </MoralisProvider>,
  document.getElementById("root")
);
