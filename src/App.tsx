import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import "./App.css";
import Lobby from "./components/lobby";
import { useState } from "react";
import { toast } from "sonner";
import ChatPage from "./components/chat-page";
type Message = {
  user: string;
  message: string;
}

function App() {

  const [conn, setConn] = useState<HubConnection>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [room,setRoom]=useState("");
  const [userName,setUsername]=useState("");
  
  const joinChat = async (username: string, chatRoom: string) => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl("http://localhost:5039/Chat")
        .configureLogging(LogLevel.Information)
        .build();

      connection.on("JoinGroupChat", (user: string, msg: string) => {
        //we don't want to show toast to user that sent the message
        if(user != username){
          toast("Message From " + user + ": " + msg);
        }
        setRoom(chatRoom);
        setUsername(user);
      });

      connection.on("ReceiveMessageInGroup",(user:string,message:string)=>{
        //we don't want to show toast to user that sent the message
        if(user != username){
          toast("Message From " + user + ": " + message);
        }
        setMessages((prevMessages) => [...prevMessages,{user,message}]);
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
        <ChatPage username={userName} chatRoom={room} connection={conn} messages={messages}/>
      )}
    </>
  );
}

export default App;
