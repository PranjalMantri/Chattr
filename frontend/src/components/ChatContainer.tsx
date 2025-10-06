import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();

  console.log("Chat container was loaded");

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  if (!authUser || !selectedUser) {
    return (
      <div className="flex-1 flex flex-col overflow-auto items-center justify-center">
        <span className="text-gray-400">Select a chat to start messaging</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwn = message.senderId === authUser._id;
          // Use correct avatar property: profilePic (authUser) and avatarUrl (selectedUser)
          const avatarSrc = isOwn
            ? authUser.profilePic || "/avatar.png"
            : selectedUser.profilePic || "/avatar.png";
          return (
            <div
              key={message._id}
              className={`chat ${isOwn ? "chat-end" : "chat-start"}`}
              ref={messageEndRef}
            >
              <div className=" chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img src={avatarSrc} alt="profile pic" />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(new Date(message.createdAt))}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
                {message.content && <p>{message.content}</p>}
              </div>
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
