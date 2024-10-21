import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import "./App.css";
import Lobby from "./components/lobby";
import { useState } from "react";
import { toast } from "sonner";
import ChatRoom from "./components/chat-page";
interface Message {
  id: number
  sender: string
  content: string
  time: string
}

function App() {

  const [conn, setConn] = useState<HubConnection>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [room,setRoom]=useState("");
  const [currentUser,setCurrentUser]=useState("");
  const [otherUser,setOtherUser]=useState("");
  
  const joinChat = async (username: string, chatRoom: string) => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl("http://localhost:5039/Chat")
        .configureLogging(LogLevel.Information)
        .build();
      setCurrentUser(username);
      setRoom(chatRoom)

      connection.on("JoinGroupChat", (user: string, msg: string) => {
        //we don't want to show toast to user that sent the message
        if(user != username){
          toast("Message From " + user + ": " + msg);
        }
      });

      connection.on("ReceiveMessageInGroup",(user:string,message:string)=>{
        //we don't want to show toast to user that sent the message
        if(user != username){
          toast("Message From " + user + ": " + message);
          setOtherUser(user);
        }
        
        const newMsg: Message = {
          id: messages.length + 1,
          sender: user,
          content: message.trim(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        setMessages((prevMessages) => [...prevMessages, newMsg]);
      });

      await connection.start();
      await connection.invoke("JoinGroupChat",{username,chatRoom});
      if (connection.state === HubConnectionState.Disconnected) {
        console.error("Connection is disconnected!");
        await connection.start();
      }
      
      setConn(connection);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
        {conn == null ? (
        <Lobby joinChat={joinChat}/>
      ) : (
        <ChatRoom chatName={room} currentUser={currentUser} otherUser={otherUser} messages={messages} connection={conn}/>
      )}
    </>
  );
}

export default App;
