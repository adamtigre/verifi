import { useState, useEffect, useCallback } from "react";
import { useContractKit } from "@celo-tools/use-contractkit";

export const useContract = (abi, contractAddress) => {
  const { getConnectedKit, address } = useContractKit();
  const [contract, setContract] = useState(null);

  const getContract = useCallback(async () => {
    const kit = await getConnectedKit();

    try {      
      // get a contract interface to interact with
      setContract(new kit.web3.eth.Contract(abi, contractAddress));
    } catch (e) {
      console.log("error from useContract: " + e);
    }
  }, [getConnectedKit, abi, contractAddress]);

  useEffect(() => {
    if (address) getContract();
  }, [address, getContract]);  

  return contract;
};
