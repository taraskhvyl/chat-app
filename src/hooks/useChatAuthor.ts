"use client";

import { useState } from "react";

const STORAGE_KEY = "chat-author";

function generateRandomName(): string {
  const adjectives = [
    "Happy",
    "Clever",
    "Brave",
    "Swift",
    "Bright",
    "Cool",
    "Wise",
    "Bold",
    "Calm",
    "Eager",
    "Fancy",
    "Gentle",
    "Jolly",
    "Kind",
    "Lively",
    "Mighty",
  ];
  const nouns = [
    "Panda",
    "Tiger",
    "Eagle",
    "Dolphin",
    "Fox",
    "Wolf",
    "Bear",
    "Lion",
    "Hawk",
    "Owl",
    "Deer",
    "Rabbit",
    "Dragon",
    "Phoenix",
    "Falcon",
    "Raven",
  ];

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 100);

  return `${adjective}${noun}${number}`;
}

export function useChatAuthor() {
  const [author] = useState(() => {
    if (typeof window === "undefined") return "";
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return stored;

    const randomName = generateRandomName();
    sessionStorage.setItem(STORAGE_KEY, randomName);
    return randomName;
  });

  return author;
}
