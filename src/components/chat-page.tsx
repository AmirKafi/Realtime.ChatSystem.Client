'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HubConnection, HubConnectionState } from '@microsoft/signalr'

interface Message {
  id: number
  sender: string
  content: string
  time: string
}

type ChatRoomProps ={
    chatName : string,
    currentUser:string,
    otherUser:string,
    messages:Message[],
    connection:HubConnection
}

export default function ChatRoom(props:ChatRoomProps) {
  const [newMessage, setNewMessage] = useState('')

  const sendMessage = async () => {
    if (props.connection.state === HubConnectionState.Disconnected) {
        console.error("Connection is disconnected!");
        await props.connection.start();
      }

    if (props.connection && newMessage) {
      try {
        await props.connection.invoke("SendMessage", newMessage);
        setNewMessage(""); // Clear the message after sending
      } catch (e) {
        console.error("Error sending message: ", e);
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage();
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Chat Header */}
      <div className="bg-card p-4 flex items-center justify-between border-b">
        <div className="flex items-center">
          <h2 className="font-semibold">{props.chatName}</h2>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {props.messages.map((message,index) => (
          <div
            key={index}
            className={`flex ${message.sender === props.currentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === props.currentUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs mt-1 opacity-70">{message.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="bg-card p-4 border-t flex">
        <Input
          type="text"
          placeholder="Type a message..."
          className="flex-1 mr-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button type="submit" size="icon" aria-label="Send message">
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  )
}