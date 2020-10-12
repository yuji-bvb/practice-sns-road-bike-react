import React from "react";
import "./App.css";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import indigo from "@material-ui/core/colors/indigo";
import Navbar from "./components/Navbar";
import ApiContextProvider from "./context/ApiContext";
import Main from "./components/Main";

//material-uiによる色の指定（テーマ設定）
const theme = createMuiTheme({
  //背景
  palette: {
    primary: indigo,
    secondary: {
      main: "#f44336",
    },
  },
  //フォント周り
  typography: {
    fontFamily: "Comic Neue",
  },
});

function App() {
  return (
    <ApiContextProvider>
      <MuiThemeProvider theme={theme}>
        {/* この中のでは全てthemeが適用される */}
        <Navbar />
        <div className="container">
          <Main />
        </div>
      </MuiThemeProvider>
    </ApiContextProvider>
  );
}

export default App;
