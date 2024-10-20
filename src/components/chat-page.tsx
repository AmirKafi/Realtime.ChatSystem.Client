// src/ChatPage.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import * as signalR from "@microsoft/signalr";
import { HubConnectionState } from "@microsoft/signalr";
type Message = {
    user: string;
    message: string;
  }

type ChatPageProps = {
    username:string,
    chatRoom:string,
    connection:signalR.HubConnection,
    messages:Message[]
}

const ChatPage = (props:ChatPageProps) => {
  const [message, setMessage] = useState<string>("");

  // Send message to the chat
  const sendMessage = async () => {
    if (props.connection.state === HubConnectionState.Disconnected) {
        console.error("Connection is disconnected!");
        await props.connection.start();
      }

    if (props.connection && message) {
      try {
        await props.connection.invoke("SendMessage", message);
        setMessage(""); // Clear the message after sending
      } catch (e) {
        console.error("Error sending message: ", e);
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-screen p-8">
      <Card className="flex-1 overflow-y-auto p-4 shadow-lg rounded-md mb-4">
        {props.messages.map((msg, index) => (
            <h6 key={index}>{msg.user} : {msg.message}</h6>
        ))}
      </Card>

      {/* Message input and send button */}
      <div className="flex">
        <Input
          className="flex-1 mr-2"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
};

export default ChatPage;
