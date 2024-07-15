import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const Payers = ({ state }) => {
  const [All_Payers, setAll_Payers] = useState([]);
  const { contract } = state;

  const Get_All_Payers = async () => {
    const Payers = await contract.get_All_Payers();
    setAll_Payers(Payers);
  };

  useEffect(() => {
    contract && Get_All_Payers();
  }, [contract]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="w-[100%]">
      <div className="flex items-center justify-center p-1">
        <h1 className="p-2 text-2xl font-semibold border bg-[rgba(119,50,50,0.59)] rounded text-white [box-shadow:0_4px_30px_rgba(0,_0,_0,_0.1)]">All Payers</h1>
      </div>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Message</th>
            <th className="border border-gray-300 px-4 py-2">From</th>
            <th className="border border-gray-300 px-4 py-2">Date, Time</th>
            <th className="border border-gray-300 px-4 py-2">Value (ETH)</th>
          </tr>
        </thead>
        <tbody>
          {All_Payers.map((payer, index) => (
            <tr key={index}>
              <td className="border border-gray-300 px-4 py-2">{payer.name}</td>
              <td className="border border-gray-300 px-4 py-2">
                {payer.message}
              </td>
              <td className="border border-gray-300 px-4 py-2">{payer.from}</td>
              <td className="border border-gray-300 px-4 py-2">
                {formatTimestamp(payer.timestamp)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {ethers.utils.formatUnits(payer.value, "ether")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        <button
          onClick={Get_All_Payers}
          className="inline-block px-6 py-2.5 text-white font-medium text-xs leading-tight uppercase rounded shadow-md bg-gray-500 hover:bg-gray-600 hover:shadow-lg focus:bg-gray-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-700 active:shadow-lg transition duration-150 ease-in-out"
        >
          Update Table
        </button>
      </div>
    </div>
  );
};

export default Payers;