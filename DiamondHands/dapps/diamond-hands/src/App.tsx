import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";

const injected = new InjectedConnector({
  supportedChainIds: [43112],
});

function App() {
  const { chainId, active, account, library, connector, activate, deactivate } =
    useWeb3React();

  const connect = async () => {
    try {
      await activate(injected);
    } catch (error) {
      console.error(error);
    }
  };

  const disconnect = async () => {
    try {
      await deactivate();
    } catch (error) {
      console.error(error);
    }
  };

  console.log(account, active, chainId);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <button onClick={connect} className="btn btn-dark py-2 mt-20 mb-4">
        Connect to MetaMask
      </button>
      {active ? (
        <span>
          Connected with <b>{account}</b>
        </span>
      ) : (
        <span>Not connected</span>
      )}
      <button onClick={disconnect} className="btn btn-dark py-2 mt-20 mb-4">
        Disconnect
      </button>
    </div>
  );
}

export default App;
