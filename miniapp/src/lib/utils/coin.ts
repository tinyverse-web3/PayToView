import axios from 'axios';
import { parseEther, Hex, stringify } from 'viem';

const usdToTvsRatio = 1000
const tonweiBitLen = 1000000000
const tonGetRatioApiUrl = 'https://tonapi.io/v2/rates?tokens=ton&currencies=ton%2Cusd%2Crub'
const ethGetRatioApiUrl = 'https://api.coinbase.com/v2/prices/ETH-USD/spot'

export const officeTonPayAddress = import.meta.env.VITE_OFFICE_TON_WALLET_ID || '';
export const officeEthPayAddress = import.meta.env.VITE_OFFICE_EVM_WALLET_ID || '';

export const getPayComment = (address: string): string => {
    return 'tvswallet=' + address + '&app=' + import.meta.env.VITE_PAY_APP_NAME
}

export const tvs2tonwei = (tvs, toUsdRatio: number): string => {
    const usd = tvs / usdToTvsRatio;
    const ton = usd / toUsdRatio;
    const tonwei = ton * tonweiBitLen;
    return tonwei.toFixed(0);
}

export const tonwei2tvs = (wei, toUsdRatio: number): string => {
    const ton = wei / tonweiBitLen;
    const usd = ton * toUsdRatio;
    const tvs = usd * usdToTvsRatio;
    return tvs.toFixed(0);
}

export const tvs2eth = (tvs, toUsdRatio: number): string => {
    const usd = tvs / usdToTvsRatio;
    const eth = usd / toUsdRatio;
    return eth.toFixed(18);
}

export const eth2tvs = (eth, toUsdRatio: number): string => {
    const usd = eth * toUsdRatio;
    const tvs = usd * usdToTvsRatio;
    return tvs.toFixed(0);
}

export const getEthToUsdRatio = async (): Promise<any> => {
    const response = await axios.get(ethGetRatioApiUrl);
    const data = response.data.data;
    return data.amount;
}

export const getTonToUsdRatio = async (): Promise<any> => {
    const response = await axios.get(tonGetRatioApiUrl);
    const prices = response.data.rates.TON.prices;
    return prices.USD;
}

export const toEthInputData = (data: string): Hex => {
    return `0x${BigInt('0x' + Buffer.from(data).toString('hex')).toString(16,)}` as Hex
}