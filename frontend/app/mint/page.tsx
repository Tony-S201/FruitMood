'use client';

import { useState } from "react";

import { Button } from "@mui/material";

const MintPage: React.FunctionComponent = (): JSX.Element => {

  interface Emoji {
    emoji: string,
    value: string
  }

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

  const [emotion, setEmotion] = useState<string>("");
  const [fruit, setFruit] = useState<string>("");

  const handleSelectEmotion = (value: string): any => {
    setEmotion(value);
  }
  const handleSelectFruit = (value: string): any => {
    setFruit(value);
  }

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
      {emotion !== "" ? (
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
        {(emotion !== "" && fruit !== "") ? (
          <>
            <div>Your selection: {emotion + ' ' + fruit}</div>
            <Button variant="contained">Mint</Button>
          </>
        ) : (<></>)}
      </div>
    </div>
  )
}

export default MintPage;