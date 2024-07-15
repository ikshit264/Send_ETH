import "./App.css";
import abi from "./contracts/Donate.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Buy from "./components/Buy";
import { IoCopy } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";

function App() {
  const [myObject, setMyObject] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [Address, setAddress] = useState();
  const [showContractAddress, setShowContractAddress] = useState(false);
  const [showUserAddress, setShowUserAddress] = useState(false);
  const [copiedContract, setCopiedContract] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = "0x1959a314D6D1E3F29f19244236575E8B584707a3";
      const contractABI = abi.abi;
      try {
        const { ethereum } = window;
        if (ethereum) {
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, contractABI, signer);
          setMyObject({ provider, signer, contract });
          setAddress(accounts[0]);
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        // Add error handling logic (e.g., display error message)
      }
    };
    
    connectWallet();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log("Copied to clipboard");
    });
  };

  const handleContractCopy = () => {
    copyToClipboard(myObject.contract.address);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  const handleAddressCopy = () => {
    copyToClipboard(Address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <div className="App bg-[rgba(255,_255,_255,_0.31)] rounded-xl [box-shadow:0_4px_30px_rgba(0,_0,_0,_0.1)] backdrop-filter backdrop-blur-[100px] border-[1px] border-[rgba(255,255,255,0.9)]">
      <header className="">
        {myObject.contract ? (
          <div className="flex flex-col items-start p-2">
            <div className="relative flex items-center justify-center w-full">
              <span
                className="group relative cursor-pointer flex items-center gap-2"
                onMouseEnter={() => setShowContractAddress(true)}
                onMouseLeave={() => setShowContractAddress(false)}
              >
                Contract Connected
                <button
                  onClick={handleContractCopy}
                  className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200"
                >
                  {copiedContract ? (
                    <FaCheck className="text-green-500" />
                  ) : (
                    <IoCopy />
                  )}
                </button>
              </span>
            </div>
            <div className="relative flex items-center justify-center w-full mt-4">
              <span
                className=" group relative cursor-pointer flex items-center gap-2"
                onMouseEnter={() => setShowUserAddress(true)}
                onMouseLeave={() => setShowUserAddress(false)}
              >
                <span>Account Connected</span>
                <button
                  onClick={handleAddressCopy}
                  className=" p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-200"
                >
                  {copiedAddress ? (
                    <FaCheck className="text-green-500" />
                  ) : (
                    <IoCopy />
                  )}
                </button>
              </span>
            </div>
            <div className="absolute top-5 left-[60%]  mt-2">
              {(showContractAddress || showUserAddress) && (
                <div
                  className={`${
                    copiedContract || copiedAddress
                      ? "bg-green-500"
                      : "bg-gray-800"
                  } text-white p-2 rounded shadow-lg`}
                >
                  {showContractAddress ? myObject.contract.address : Address}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>Not connected to contract</div>
        )}
      </header>
      <div>
        <Buy state={myObject} />
      </div>
    </div>
  );
}

export default App;
