import { useEffect, useState } from 'react';
import './App.css';
import contract from './contracts/MyNFT.json';
require('dotenv').config();
const API_URL = process.env.REACT_APP_API_URL;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contractAddress = "0xFB98EbdC2d9299C517631107DE7Bc2Ca72590e09";
const abi = contract.abi;
const nftContract = new web3.eth.Contract(abi, contractAddress);

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

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.lenght !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
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

  const mintNftHandler = async () => { 

    try {
      const { ethereum } = window;

      if (ethereum) {
        
        //const nonce = await web3.eth.getTransactionCount(currentAccount, 'latest'); //get latest nonce
        const tokenURI = "https://gateway.pinata.cloud/ipfs/QmSo4XQhb3sATR6Ln6JPvBoFuFKQmGgiqwdoGShNx4wRe7";

        const tx = {
          'from': currentAccount,
          'to': contractAddress,
          //'nonce': nonce,
          'gas': "500000",
          // 'maxPriorityFeePerGas': "2999999987",
          'data': nftContract.methods.safeMint(currentAccount, tokenURI).encodeABI()
        };

        try {
          const txHash = await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [tx],
          });
          const receipt = await txHash.wait();
          console.log(`Mined, see transaction: https://ropsten.etherscan.io/tx/${receipt.transactionHash}`);
        } catch (error) {
          return {
            status: "😥 " + error.message,
          };
        }
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  }

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
      Mint Book
    </button>
  )
}

useEffect(() => {
  checkWalletIsConnected();
}, [])

  return (
    <div className='main-app'>
      <h1>Bookverse Alpha</h1>
      <div>
        {currentAccount ? mintNftButton() : connectWalletButton()}
      </div>
    </div>
  )
}

export default App;