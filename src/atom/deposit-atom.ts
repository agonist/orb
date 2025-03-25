import { chainsList, assetsList } from "@/dummy";
import type { Asset, Chain } from "@/types";
import { atom } from "jotai";

export const selectedChainAtom = atom<Chain>(chainsList[0]);
export const selectedAssetAtom = atom<Asset>(assetsList["Ethereum"][0]);
