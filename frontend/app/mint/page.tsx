'use client';

import { useState } from "react";

// UI components
import { Button } from "@mui/material";

// Wagmi
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

// Constants
import { contractAddress, contractAbi } from "../constants/fruitfablenft";
import { fruitIds, emotionIds } from "../constants/tokenIds";

const MintPage: React.FunctionComponent = (): JSX.Element => {

  interface Emoji {
    emoji: string,
    value: string
  };

  const emotions: Emoji[] = [
    {
      emoji: "😀",
      value: "happy"
    },
    {
      emoji: "😭",
      value: "sad"
    },
    {
      emoji: "😠",
      value: "angry"
    },
    {
      emoji: "😯",
      value: "scared"
    },
    {
      emoji: "😱",
      value: "shoked"
    }
  ];

  const fruits: Emoji[] = [
    {
      emoji: "🍎",
      value: "apple"
    },
    {
      emoji: "🍋",
      value: "lemon"
    },
    {
      emoji: "🍊",
      value: "orange"
    },
    {
      emoji: "🍍",
      value: "pineapple"
    },
    {
      emoji: "🍓",
      value: "strawberry"
    }
  ]

  const [selectedEmotion, setEmotion] = useState<string>("");
  const [selectedFruit, setFruit] = useState<string>("");

  const handleSelectEmotion = (value: string): void => {
    setEmotion(value);
  };
  const handleSelectFruit = (value: string): void => {
    setFruit(value);
  };

  // Mint part
  const { writeContractAsync, data: hash, isPending } = useWriteContract();

  const { isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
  });

  const handleMintNft = async() => {
    try {
      const result = await writeContractAsync({
        abi: contractAbi,
        address: contractAddress,
        functionName: 'mint',
        args: [fruitIds[selectedFruit as keyof typeof fruitIds], emotionIds[selectedEmotion as keyof typeof emotionIds], 1, "0x"]
      });
      console.log('Transaction hash:', result);
    } catch (err) {
      console.error('Error minting NFT:', err);
    }
  };

  return (
    <div className="min-h-screen">
      <h2 className="text-2xl text-center">Select An Emotion</h2>
      <div className="flex items-center justify-center gap-6 mb-6">
        {emotions.map((item, index) => (
          <div onClick={() => handleSelectEmotion(item.value)} key={index} className="border-4 border-indigo-600 rounded p-8 cursor-pointer">
            <div className="text-6xl">{item.emoji}</div>
          </div>
        ))}
      </div>
      {selectedEmotion !== "" ? (
        <>
          <h2 className="text-2xl text-center">Select a Fruit</h2>
          <div className="flex items-center justify-center gap-6 mb-6">
            {fruits.map((item, index) => (
              <div onClick={() => handleSelectFruit(item.value)} key={index} className="border-4 border-indigo-600 rounded p-8 cursor-pointer">
                <div className="text-6xl">{item.emoji}</div>
              </div>
            ))}
          </div>
        </>
      ) : (<></>)}
      <div className="w-full text-center">
        {(selectedEmotion !== "" && selectedFruit !== "") ? (
          <>
            <div>Your selection: {selectedEmotion + ' ' + selectedFruit}</div>
            <Button onClick={() => handleMintNft()} variant="contained">Mint</Button>
          </>
        ) : (<></>)}
        <div>
          {isPending && <p>Loading...</p>}
          {isError && <p>Error during the transaction</p>}
          {isSuccess && <p>Success: tx confirmed</p>}
        </div>
      </div>
    </div>
  )
}

export default MintPage;