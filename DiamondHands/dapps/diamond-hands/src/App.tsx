import React, { useEffect } from "react";
import "./App.css";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import Web3 from "web3";
import DiamondHandsABI from "./abi/DiamondHandsABI.json";

const injected = new InjectedConnector({
  supportedChainIds: [1337],
});

function App() {
  const { active, account, activate, deactivate } = useWeb3React();
  const web3 = new Web3((window as any).ethereum);
  const DiamondHands = new web3.eth.Contract(
    DiamondHandsABI.abi as any,
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );

  const connect = async () => {
    try {
      await activate(injected);
    } catch (error) {
      console.error(error);
    }
  };

  const getFee = async () => {
    DiamondHands.methods.fee.call().then(console.log);
  };

  const disconnect = async () => {
    try {
      await deactivate();
    } catch (error) {
      console.error(error);
    }
  };

  const enableWeb3 = async () => {
    await (window as any).ethereum.enable();
  };

  useEffect(() => {
    if (active) {
      enableWeb3();
    }
  }, [active]);

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
      {active && (
        <button onClick={getFee} className="btn btn-dark py-2 mt-20">
          Get fee
        </button>
      )}
    </div>
  );
}

export default App;
