import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [depositAmount, setDepositAmount] = useState(1); // Default deposit amount
  const [itemInput, setItemInput] = useState(""); // User input for buying items

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({
      method: "eth_requestAccounts",
    });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(
      contractAddress,
      atmABI,
      signer
    );

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(depositAmount);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
    }
  };

  const buyItem = async () => {
    if (atm) {
      let tx = await atm.buyItem(itemInput, { gasLimit: 20000000 });
      await tx.wait();
      getBalance();
    }
  };

  const handleDepositAmountChange = (event) => {
    setDepositAmount(Number(event.target.value));
  };

  const handleItemInputChange = (event) => {
    setItemInput(event.target.value);
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask to use this ATM.</p>;
    }

    // Check to see if the user is connected. If not, connect to their account
    if (!account) {
      return (
        <button onClick={connectAccount}>
          Please connect your Metamask wallet
        </button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <label>
          Deposit Amount:
          <input
            type="number"
            value={depositAmount}
            onChange={handleDepositAmountChange}
          />
        </label>
        
        <button onClick={deposit}>Deposit</button>
        <br />
        <br />
        <button onClick={withdraw}>Withdraw 1 ETH</button>
        <br />
        <br />
        <div className="boldText">Menu</div>
        <p>Calamares      150 ETH</p>
        <p>Bulalo         400 ETH</p>
        <p>Lechon         600 ETH</p>
        <label>
          Order Food:
          <input
            type="Food Name"
            value={itemInput}
            onChange={handleItemInputChange}
          />
        </label>
        <button onClick={buyItem}>Order</button>
      </div>

    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }

        .boldText {
          font-weight: bold;
          font-size: 24px;
        }
      `}</style>
    </main>
  );
};
