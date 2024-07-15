import React, { useState } from "react";
import { ethers } from "ethers";
import Payers from "./Payers";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Buy = ({ state }) => {
  const { contract } = state;
  const [MyForm, setMyForm] = useState({ Name: "", Message: "", Amount: "" });
  const [isLoading, setIsLoading] = useState(false);

  const HandleChange = (e) => {
    setMyForm({
      ...MyForm,
      [e.target.name]: e.target.value,
    });
  };


  function extractErrorMessage(error) {
    const errorMessage = error.message;
    const splitMessage = errorMessage.split("execution reverted: ");
    const relevantPart = splitMessage.length > 1 ? splitMessage[1] : errorMessage;
    const relevantPartQuoteIndex = relevantPart.indexOf('"');
    const relevantMessage = (relevantPartQuoteIndex !== -1) ? relevantPart.slice(0, relevantPartQuoteIndex).trim() : relevantPart.trim();  

    return relevantMessage || "Transaction failed";
  }
  
  const HandleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const amountInEther = ethers.utils.parseEther(MyForm.Amount.toString());
      const transaction = await contract.send_ETH(MyForm.Name, MyForm.Message, {
        value: amountInEther,
      });
      await transaction.wait();
      toast.success("Transaction completed successfully!");
    } catch (err) {
      if (err.message.includes("from address mismatch")) {
        toast.error("Transaction failed: There was an address mismatch. Please check your account and try again.");
      } else {
        const error = extractErrorMessage(err);
        toast.error(`Transaction failed: ${error}`);
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="w-full p-2">
      <form onSubmit={HandleSubmit} className="flex justify-around py-2">
        <div className="flex gap-2 items-center">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="border-black rounded-md border-2 p-1 text-sm"
            onChange={HandleChange}
            value={MyForm.Name}
            disabled={isLoading}
            placeholder="Enter Name"
            name="Name"
            id="name"
            required
          />
        </div>
        <div className="flex gap-2 items-center">
          <label htmlFor="message">Message</label>
          <input
            type="text"
            className="border-black rounded-md border-2 p-1 text-sm"
            onChange={HandleChange}
            value={MyForm.Message}
            disabled={isLoading}
            placeholder="Enter Message"
            name="Message"
            id="message"
            required
          />
        </div>
        <div className="flex gap-2 items-center">
          <label htmlFor="Amount">Amount</label>
          <input
            type="text"
            name="Amount"
            onChange={HandleChange}
            disabled={isLoading}
            className="border-black rounded-md border-2 p-1 text-sm"
            value={MyForm.Amount}
            id="Amount"
            placeholder="Enter the Amount"
            pattern="^\d+(\.\d{1,18})?$"
            title="Enter a valid decimal number with up to 18 decimal places"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-block px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md bg-green-500 hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out"
        >
          {isLoading ? "Processing..." : "Send ETH"}
        </button>
      </form>
      <ToastContainer />
      <Payers state={state} />
    </div>
  );
};

export default Buy;
