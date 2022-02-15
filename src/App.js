import { useEffect, useState } from 'react';
import './App.css';
import contract from './contracts/MyNFT.json';

const contractAddress = "0xFB98EbdC2d9299C517631107DE7Bc2Ca72590e09";
const abi = contract.abi;

function App() {

  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have Metamask installed");
      return;
    } else {
      console.log("Wallet exists! We're ready to go")
    }
  }
  
  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err)
    }
  }

  const mintNftHandler = () => { }
  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
    </button>
  )
}

const mintNftButton = () => {
  return (
    <button onClick={mintNftHandler} className='cta-button mint-nft-button'>
      Mint NFT
    </button>
  )
}

useEffect(() => {
  checkWalletIsConnected();
}, [])

  return (
    <div className='main-app'>
      <h1>Scrappy Squirrels Tutorial</h1>
      <div>
        {connectWalletButton()}
      </div>
    </div>
  )
}

export default App;