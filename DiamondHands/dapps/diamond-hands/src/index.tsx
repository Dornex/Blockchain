import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Web3ReactProvider, createWeb3ReactRoot } from "@web3-react/core";
import Web3 from "web3";
import { provider } from "web3-core";
import "bootstrap/dist/css/bootstrap.css";

function getLibrary(provider: provider) {
  return new Web3(provider);
}

const Web3ReactProviderReloaded = createWeb3ReactRoot("anotherOne");

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <Web3ReactProviderReloaded getLibrary={getLibrary}>
      <App />
    </Web3ReactProviderReloaded>
  </Web3ReactProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
