'use client';

import { useState } from "react";

const MintPage: React.FunctionComponent = (): JSX.Element => {

  interface Emoji {
    emoji: string,
    value: string
  }

  const emojis: Emoji[] = [
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
    },
  ]

  const [emotion, setEmotion] = useState<string>("");

  const handleSelectEmotion = (value: string): any => {
    setEmotion(value);
  }

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center gap-6">
        {emojis.map((item, index) => (
          <div onClick={() => handleSelectEmotion(item.value)} key={index} className="border-4 border-indigo-600 rounded p-8 cursor-pointer">
            <div className="text-6xl">{item.emoji}</div>
          </div>
        ))}
      </div>
      <div>{emotion}</div>
    </div>
  )
}

export default MintPage;