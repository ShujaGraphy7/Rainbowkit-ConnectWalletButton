import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "@rainbow-me/rainbowkit/styles.css";

import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  mainnet,
  scrollSepolia,
  sepolia,
  polygonZkEvmTestnet,
  arbitrumSepolia,
  mantleTestnet,
  polygonMumbai,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";

const { chains, publicClient } = configureChains(
  [
    polygonMumbai,
    mainnet,
    scrollSepolia,
    sepolia,
    polygonZkEvmTestnet,
    arbitrumSepolia,
    mantleTestnet,
  ],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <WagmiConfig config={wagmiConfig}>
  <React.StrictMode>
      <RainbowKitProvider
        chains={chains}
        modalSize={{
          smallScreen: "compact",
          largeScreen: "wide",
        }}
        theme={darkTheme({
          accentColor: "#ec4899",
          accentColorForeground: "white",
          overlayBlur: "large",
          borderRadius: "large",
        })}
      >
        <App />
      </RainbowKitProvider>
    </React.StrictMode>
  </WagmiConfig>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
