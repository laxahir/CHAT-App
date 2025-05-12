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
//     let newSocket;
//     if (authUser) {
//       newSocket = io("http://localhost:3000", {
//         query: {
//           userId: authUser._id,
//         },
//       });

//       newSocket.on("getOnlineUsers", (users) => {
//         setOnlineUser(users);
//       });

//       setSocket(newSocket);

//       return () => newSocket.close();
//     } else {
//       if (socket) {
//         socket.close();
//         setSocket(null);
//       }
//     }
//   }, [authUser]);

//   return (
//     <SocketContext.Provider value={{ socket, onlineUser }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const { authUser } = useAuth();

  useEffect(() => {
    // If there's no auth user, don't connect
    if (!authUser) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const newSocket = io("https://lax-chatapp.onrender.com", {
      query: { userId: authUser._id },
    });

    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUser(users);
    });

    setSocket(newSocket);

    // Cleanup on unmount or user change
    return () => {
      newSocket.disconnect();
    };
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUser }}>
      {children}
    </SocketContext.Provider>
  );
};
