import * as React    from "react";
import * as ReactDOM from "react-dom/client";

import {CssBaseline, ThemeProvider, createTheme} from "@mui/material";

import App from "./app";

const theme = createTheme({typography: {fontFamily: "Open Sans"}});
const myDOM = ReactDOM.createRoot(document.getElementById("root"));

myDOM.render(
  <React.Fragment>
    <CssBaseline />
    <ThemeProvider theme={theme}><App /></ThemeProvider>
  </React.Fragment>
);
