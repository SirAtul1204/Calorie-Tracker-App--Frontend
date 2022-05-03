import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createStore } from "redux";
import Auth from "./Components/Auth.component";
import "./index.css";
import Home from "./Pages/Home";
import Invite from "./Pages/Invite";
import Report from "./Pages/Report";
import CustomSnackbar from "./Components/CustomSnackbar.component";
import { rootReducer } from "./Reducers/Root.reducer";
import reportWebVitals from "./reportWebVitals";
import Nav from "./Components/Nav.component";
import { ThemeProvider } from "@mui/material";
import { theme } from "./MaterialTheme";

const store = createStore(rootReducer);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<Auth element={Home} roles={["REGULAR", "ADMIN"]} />}
            />
            <Route
              path="/invite"
              element={<Auth roles={["ADMIN", "REGULAR"]} element={Invite} />}
            />
            <Route
              path="/report"
              element={<Auth roles={["ADMIN"]} element={Report} />}
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
      <CustomSnackbar />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
