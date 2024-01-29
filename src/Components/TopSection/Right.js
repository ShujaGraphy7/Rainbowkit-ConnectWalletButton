import React, { useState, useEffect } from "react";
import { FaEthereum } from "react-icons/fa";
import "../../Custom.css";
import { useAccount, useContract, useProvider } from "wagmi";
// import Presale from "../ABIs/Presale.json";
import Hydromotion from "../ABIs/Hydromotion.json";
import { fetchBalance, getAccount } from "@wagmi/core";
import ETHbuy from "../MintPop/ETHbuy";
import FiatBuy from "../MintPop/FiatBuy";
import { ethers } from "ethers";

const presaleAddress = process.env.REACT_APP_PRESALE_ADDRESS;
const hydromotionAddress = process.env.REACT_APP_HYDROMOTION_ADDRESS;

function Right() {
  // eslint-disable-next-line
  const { isConnected } = useAccount();
  const account = getAccount();

  const provider = useProvider();

  const hydromotion = useContract({
    address: hydromotionAddress,
    abi: Hydromotion,
    signerOrProvider: provider,
  });

  const privateKey = process.env.REACT_APP_ADMIN_PRIVATEkEY;
  const NODE_URL = process.env.REACT_APP_NODE_URL;

  const customProvider = new ethers.providers.JsonRpcProvider(NODE_URL);

  const customSigner = new ethers.Wallet(privateKey, customProvider);

  const customContract_Inst = new ethers.Contract(
    hydromotionAddress,
    Hydromotion,
    customSigner
  );

  // UserInfo

  const [balance, setBalance] = useState("0");
  const [userAddress, setUserAddress] = useState("0x00...");
  const getUserInfo = async () => {
    isConnected &&
      setUserAddress(
        account?.address !== undefined
          ? account?.address?.slice(0, 5) + "..." + account?.address?.slice(-5)
          : ""
      );
    const balance = await fetchBalance({
      address: account?.address,
    });
    isConnected &&
      setBalance(parseFloat(balance?.formatted).toFixed(5) + " ETH");
  };

  // ------------------------------------------------------------- //

  // TokenInfo
  const [totalTokens, setTotalTokens] = useState("0");
  const [AvailableForICO, setAvailableForICO] = useState("0");
  const [currentICOround, setCurrentICOround] = useState("1");
  const [currentTokenPrice, setCurrentTokenPrice] = useState(
    "Information Not Available"
  );
  const [yourTokenBalance, setYourTokenBalance] = useState("0");

  useEffect(() => {
    getTokenInfo__TotalTokens();
    getTokenInfo__AvailableForICO();
    getTokenInfo__CurrentICOround();
    getTokenInfo__CurrentTokenPrice();
    isConnected && getTokenInfo__YourTokenBalance();
    isConnected && getUserInfo();
    // eslint-disable-next-line
  }, [account]);
  const getTokenInfo__TotalTokens = async () => {
    await customContract_Inst?.totalSupply().then((res) => {
      setTotalTokens(parseFloat(res) / 10 ** 2);
    });
  };

  const getTokenInfo__YourTokenBalance = async () => {
    isConnected &&
      (await hydromotion?.balanceOf(account?.address).then((res) => {
        setYourTokenBalance(parseFloat(res) / 10 ** 2);
      }));
  };

  const getTokenInfo__AvailableForICO = async () => {
    await customContract_Inst?.balanceOf(presaleAddress).then((res) => {
      setAvailableForICO(parseFloat(res) / 10 ** 2);
    });
  };

  const getTokenInfo__CurrentICOround = async () => {
    await customContract_Inst?.balanceOf(presaleAddress).then((res) => {
      let resp = res;
      if (resp <= 1000000000000) setCurrentICOround("4");
      else if (resp <= 2000000000000) setCurrentICOround("3");
      else if (resp <= 3000000000000) setCurrentICOround("2");
      else if (resp <= 4000000000000) setCurrentICOround("1");
      else setCurrentICOround("No Round Left");
    });
  };

  const getTokenInfo__CurrentTokenPrice = async () => {
    await customContract_Inst?.balanceOf(presaleAddress).then((res) => {
      let resp = res;
      if (resp <= 1000000000000) setCurrentTokenPrice("10");
      else if (resp <= 2000000000000) setCurrentTokenPrice("1");
      else if (resp <= 3000000000000) setCurrentTokenPrice("0.1");
      else if (resp <= 4000000000000) setCurrentTokenPrice("0.01");
      else setCurrentTokenPrice("Presale Already Ended");
    });
  };

  // ------------------------------------------------------------- //

  // popHandeler
  const [ETHpop, setETHpop] = useState(false);
  const ethPopHandel = () => {
    ETHpop ? setETHpop(false) : setETHpop(true);
  };

  const [FiatPop, setFiatPop] = useState(false);
  const fiatPopHandel = () => {
    FiatPop ? setFiatPop(false) : setFiatPop(true);
  };
  // --------------------------------------------------------------- //

  return (
    <div className="text-lime-900 lg:mx-24 p-10 bg-[#00000023] rounded-3xl lg:w-[80%]">
      <div className=" border border-lime-900 main-bg rounded-2xl">
        <div className="relative p-10 bg-[#ffffffaf] rounded-2xl h-60">
          <div className="flex items-center justify-between font-bold text-2xl uppercase text-lime-900">
            <div className="flex item-center">BENUTZER INFO</div>
            <div className="border border-lime-900 p-2 rounded-full text-lime-900">
              <FaEthereum />
            </div>
          </div>
          <div className="mt-10 font-semibold text-2xl uppercase text-lime-900">
            <p>{balance}</p>
          </div>
          <div className="absolute bottom-5 font-normal text-xs text-lime-900">
            <p>
              Adresse: <span>{userAddress}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 py-5">
        <div>
          <p>
            <b>Token insgesamt:</b>{" "}
            <span>
              {parseFloat(totalTokens)
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              HYM
            </span>
          </p>
        </div>
        <div>
          <p>
            <b>Verfügbar für ICO:</b>{" "}
            <span>
              {parseFloat(AvailableForICO)
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              HYM
            </span>
          </p>
        </div>
        <div>
          <p>
            <b>Aktuelle ICO-Runde: </b>
            <span>{currentICOround}</span>
          </p>
        </div>
        <div>
          <p>
            <b>Aktueller Token-Preis:</b> <span>{currentTokenPrice} EUR</span>
          </p>
        </div>

        <div>
          <p>
            <b>Ihr Token-Guthaben:</b>{" "}
            <span>
              {parseFloat(yourTokenBalance)
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              HYM
            </span>
          </p>
        </div>
      </div>

      <div className="m-5 grid grid-cols-1 gap-5">
        {account.address ? (
          <>
            <button
              onClick={() => ethPopHandel()}
              className="bg-lime-600 hover:bg-lime-700 p-3 px-5 rounded-full text-white font-bold"
            >
              Token mit ETH kaufen
            </button>
          </>
        ) : (
          <>
            <button
              disabled={true}
              className="bg-[#64a30d62] p-3 px-5 rounded-full text-white font-bold"
            >
              Token mit ETH kaufen
            </button>
          </>
        )}
        <button
          onClick={() => fiatPopHandel()}
          className="border-2 border-lime-700 hover:border-lime-800 p-3 px-5 rounded-full text-lime-700 hover:text-lime-800 font-bold"
        >
          Kaufen Sie Token mit EUR
        </button>
      </div>
      {ETHpop ? <ETHbuy cancel={() => ethPopHandel()} /> : null}
      {FiatPop ? (
        <FiatBuy
          cancel={() => {
            fiatPopHandel();
          }}
          currentPrice={currentTokenPrice}
        />
      ) : null}
    </div>
  );
}

export default Right;
