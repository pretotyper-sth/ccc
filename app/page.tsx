"use client";

import ChatPage from "./ChatPage";
import { COPY_KR } from "./chat-copy";

export default function Home() {
  return <ChatPage copy={COPY_KR} />;
}
