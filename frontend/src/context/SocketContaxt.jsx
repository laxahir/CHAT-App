// import React, { createContext, useContext, useEffect, useState } from "react";
// import io from "socket.io-client";
// import { useAuth } from "./AuthContext";

// const SocketContext = createContext();

// export const useSocketContext = () => {
//   return useContext(SocketContext);
// };

// export const SocketContextProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [onlineUser, setOnlineUser] = useState([]);
//   const { authUser } = useAuth();

//   useEffect(() => {
//     // If there's no auth user, don't connect
//     if (!authUser) {
//       if (socket) {
//         socket.disconnect();
//         setSocket(null);
//       }
//       return;
//     }

//     const newSocket = io("http://localhost:3000", {
//       query: { userId: authUser._id },
//     });

//     newSocket.on("getOnlineUsers", (users) => {
//       setOnlineUser(users);
//     });

//     setSocket(newSocket);

//     // Cleanup on unmount or user change
//     return () => {
//       newSocket.disconnect();
//     };
//   }, [authUser]);

//   return (
//     <SocketContext.Provider value={{ socket, onlineUser }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client"; // fixed import
import { useAuth } from "./AuthContext";

// Create context
const SocketContext = createContext();

// Custom hook to use socket context
export const useSocketContext = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const { authUser } = useAuth();

  useEffect(() => {
    if (!authUser) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io("http://localhost:8001", {
      query: {
        userId: authUser._id,
      },
      withCredentials: true, // optional but recommended
    });

    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUser(users);
    });

    // Cleanup
    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUser }}>
      {children}
    </SocketContext.Provider>
  );
};
