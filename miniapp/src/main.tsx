import ReactDOM from 'react-dom/client';
import '@/locales';
import App from '@/App';
import 'react-photo-view/dist/react-photo-view.css';
import '@/style/tailwind.css';
import '@/style/index.css';


// for eth begin
import React from "react";
import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react";

import { WagmiConfig } from "wagmi";
import {
    mainnet,
    sepolia

} from "wagmi/chains";

let chains = [
    mainnet,
    sepolia
];

const projectId = import.meta.env.VITE_EVM_WALLET_CONNECT_PROJECT_ID || "";

const metadata = {
    name: "mini paytoview",
    description: "mini paytoview",
    url: "https://tinyverse.minipaytoview.com",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const wagmiConfig = defaultWagmiConfig({ chains: chains, projectId, metadata });
createWeb3Modal({ wagmiConfig, projectId, chains: chains });

if (import.meta.env.MODE === "production") {
    chains = chains.filter(chain => chain !== sepolia);
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    // <React.StrictMode>
        <WagmiConfig config={wagmiConfig}>
            <App />
        </WagmiConfig>
    // </React.StrictMode>
);

// ReactDOM.createRoot(document.getElementById('root')!).render(<App />);

// for eth end