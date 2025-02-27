'use client';

import { useState, useCallback } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";

// UI components
import { Button, Grow } from "@mui/material";

// Wagmi & Viem
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { type Hash } from "viem";

// Constants
import { contractData, explorerUrl } from "../constants/fruitfMoodNft";
import { fruitIds, emotionIds } from "../constants/tokenIds";
import { fruits, emotions } from "../constants/emojis";

const MintPage: React.FunctionComponent = (): JSX.Element => {

  const [selectedEmotion, setEmotion] = useState<string>("");
  const [selectedFruit, setFruit] = useState<string>("");
  const [tx, setTx] = useState<Hash | null>(null);

  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();

  const handleSelectEmotion = useCallback((value: string): void => {
    setEmotion(value);
  }, []);
  const handleSelectFruit = useCallback((value: string): void => {
    setFruit(value);
  }, []);

  // Mint part
  const { writeContractAsync, data: hash, isPending } = useWriteContract();
  const { isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
  });

  const handleMintNft = async() => {
    try {
      setTx(null);
      const result = await writeContractAsync({
        ...contractData,
        functionName: 'mint',
        args: [fruitIds[selectedFruit as keyof typeof fruitIds], emotionIds[selectedEmotion as keyof typeof emotionIds], 1, "0x"]
      });
      setTx(result);
    } catch (err) {
      console.error('Error minting NFT:', err);
    }
  };

  return (
    <div className="min-h-screen py-20 mt-10">
      <div className="container mx-auto px-4">
        <Grow in timeout={125}>
          <h2 className="text-3xl font-bold text-center mb-4">Mint Your FruitMood NFT</h2>
        </Grow>
        <div className="bg-white bg-opacity-80 shadow-lg rounded-lg p-6 mx-auto max-w-3xl">
          <Grow in timeout={250}>
            <div>
              <h3 className="text-2xl font-bold text-center mb-6">Select An Emotion</h3>
              <div className="grid grid-cols-5 gap-4 mb-10">
                {emotions.map((item, index) => (
                  <div
                    onClick={() => handleSelectEmotion(item.value)}
                    key={index}
                    className={`border-4 ${selectedEmotion === item.value ? 'border-red-500' : 'border-orange-500'} rounded-lg p-4 cursor-pointer transition duration-200 ease-in-out transform hover:scale-110`}
                  >
                    <div className="text-4xl text-center">{item.emoji}</div>
                  </div>
                ))}
              </div>
            </div>
          </Grow>
          {selectedEmotion !== "" ? (
            <Grow in timeout={375}>
              <div>
                <h3 className="text-2xl font-bold text-center mb-6">Select a Fruit</h3>
                <div className="grid grid-cols-5 gap-4 mb-10">
                  {fruits.map((item, index) => (
                    <div
                      onClick={() => handleSelectFruit(item.value)}
                      key={index}
                      className={`border-4 ${selectedFruit === item.value ? 'border-red-500' : 'border-orange-500'} rounded-lg p-4 cursor-pointer transition duration-200 ease-in-out transform hover:scale-110`}
                    >
                      <div className="text-4xl text-center">{item.emoji}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Grow>
          ) : (<></>)}
          <div className="text-center">
            {(selectedEmotion !== "" && selectedFruit !== "") ? (
              <Grow in timeout={500}>
                <div>
                  <p className="text-xl mb-4">Your selection: {selectedEmotion + ' ' + selectedFruit}</p>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => {
                      isConnected ? handleMintNft() : openConnectModal?.()
                    }}
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold py-4 px-8 rounded-full shadow-lg transition duration-200 ease-in-out transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-300"
                  >
                    {isConnected ? 'Mint NFT' : 'Connect Wallet'}
                  </Button>
                </div>
              </Grow>
            ) : (<></>)}
            <div className="mt-3">
              {isPending && <Grow in timeout={625}><p className="text-lg">Loading...</p></Grow>}
              {isError && <p className="text-lg text-red-500">Error during the transaction</p>}
              {isSuccess && <p className="text-lg text-green-500">Success: Transaction confirmed</p>}
              {(!isPending && isSuccess && tx) && <a href={`${explorerUrl}${tx}`} target="_blank" className="underline text-orange-500 hover:text-red-500">Transaction Hash</a>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MintPage;