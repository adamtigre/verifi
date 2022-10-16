import { useContract } from "./useContract";
import VERIFI_DATA from "../contracts/Verifi-data.json";
import VERIFI_ADDRESS from "../contracts/Verifi-address.json";

// export interface for NFT contract
export const useVerifiContract = () =>
  useContract(VERIFI_DATA.abi, VERIFI_ADDRESS.Verifi);
