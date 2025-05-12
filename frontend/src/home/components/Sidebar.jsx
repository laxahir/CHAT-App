// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { FaSearch } from "react-icons/fa";
// import { BiLogOutCircle } from "react-icons/bi";
// import { TbArrowBigLeftLinesFilled } from "react-icons/tb";
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import userConversation from "../../zustand/useConversation";
// import { useSocketContext } from "../../context/SocketContaxt";

// const Sidebar = ({ onSelectUser }) => {
//   const navigate = useNavigate();
//   const { authUser, setAuthUser } = useAuth();
//   const [searchInput, setSearchInput] = useState("");
//   const [searchResults, setSearchResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [chatUsers, setChatUsers] = useState([]);
//   const [selectedUserId, setSelectedUserId] = useState(null);
//   const { onlineUser, socket } = useSocketContext();
//   const { messages, selectedConversation, setSelectedConversation } =
//     userConversation();

//   // chats function

//   const nowOnline = chatUsers.map((user) => user._id);

//   const isOnline = nowOnline.map((userId) => onlineUser.include(userId));

//   useEffect(() => {
//     const fetchChatUsers = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get("/api/user/getcurrentchatter");
//         if (res.data && Array.isArray(res.data)) {
//           setChatUsers(res.data);
//         } else {
//           toast.info("No users found.");
//         }
//       } catch (err) {
//         toast.error("Failed to fetch chat users.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchChatUsers();
//   }, []);

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     if (!searchInput.trim()) return;

//     setLoading(true);
//     try {
//       const res = await axios.get(`/api/user/search?search=${searchInput}`);
//       if (res.data && Array.isArray(res.data)) {
//         if (res.data.length === 0) {
//           toast.info("User not found.");
//         }
//         setSearchResults(res.data);
//       } else {
//         toast.error("Unexpected response.");
//       }
//     } catch (err) {
//       toast.error("Search failed.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUserClick = (user) => {
//     onSelectUser(user);
//     setSelectedConversation(user);
//     setSelectedUserId(user._id);
//     // navigate(`/chat/${user._id}`); // optional: navigate to chat screen
//   };

//   const handleSearchBack = () => {
//     setSearchResults([]);
//     setSearchInput("");
//   };

//   const HandleLogout = async () => {
//     const confirmLogout = window.prompt("Type 'UserName' To LOGOUT ");
//     if (confirmLogout === authUser.username) {
//       setLoading(true);
//       try {
//         const logout = await axios.post("/api/auth/logout");
//         const data = logout.data;
//         if (data.success === false) {
//           setLoading(false);
//           console.log(data.message);
//         }
//         toast.info(data.message);
//         localStorage.removeItem("chatapp");
//         setAuthUser(null);
//         setLoading(false);
//         navigate("/login");
//       } catch (error) {
//         setLoading(false);
//         console.log(error);
//       }
//     } else {
//       toast.info("Lougout Cancelled");
//     }
//   };

//   const renderUserList = (users) => (
//     <>
//       <div className="w-auto overflow-y-auto max-h-[calc(100vh-60px)] pr-2">
//         {users
//           .filter((user) => user && user._id)
//           .map((user) => (
//             <div key={user._id}>
//               <div
//                 onClick={() => handleUserClick(user)}
//                 className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${
//                   selectedUserId === user._id ? "bg-sky-500" : ""
//                 }`}
//               >
//                 <div className={`avatar ${isOnline[index] ? "online" : ""}`}>
//                   <div className="w-12 h-12 rounded-full overflow-hidden">
//                     <img src={user.profilepic} alt="user" />
//                   </div>
//                 </div>
//                 <div className="flex flex-col flex-1">
//                   <p className="font-bold text-gray-950">{user.username}</p>
//                 </div>
//               </div>
//               <div className="divider divide-solid px-3 h-[1px]"></div>
//             </div>
//           ))}
//       </div>

//       {/* Back Arrow */}
//       {searchResults.length > 0 && (
//         <div className="fixed bottom-4 left-6.5 transform -translate-x-1/2 z-50">
//           <button
//             onClick={handleSearchBack}
//             className="bg-white rounded-full px-2 py-1 shadow"
//           >
//             <TbArrowBigLeftLinesFilled
//               size={30}
//               className="text-gray-700 hover:text-black cursor-pointer"
//             />
//           </button>
//         </div>
//       )}
//     </>
//   );

//   return (
//     <div className="relative h-screen w-auto px-1 flex flex-col">
//       {/* Top section */}
//       <div className="flex justify-between gap-2">
//         <form
//           onSubmit={handleSearch}
//           className="w-auto flex items-center justify-between bg-white rounded-full"
//         >
//           <input
//             value={searchInput}
//             onChange={(e) => setSearchInput(e.target.value)}
//             type="text"
//             placeholder="Search user"
//             className="px-4 w-auto text-black bg-transparent outline-none rounded-full"
//           />
//           <button
//             type="submit"
//             className="btn btn-circle bg-sky-700 hover:bg-gray-950"
//           >
//             <FaSearch />
//           </button>
//         </form>
//         <img
//           onClick={() => navigate(`/profile/${authUser._id}`)}
//           src={authUser?.profilepic}
//           className="self-center h-12 w-12 hover:scale-110 cursor-pointer rounded-full"
//           alt="profile"
//         />
//       </div>

//       <div className="divider px-3"></div>

//       {/* Scrollable user list area */}
//       <div className="flex-1 overflow-y-auto scrollbar">
//         {loading ? (
//           <p className="text-center text-gray-500">Loading...</p>
//         ) : searchResults.length > 0 ? (
//           renderUserList(searchResults)
//         ) : chatUsers.length > 0 ? (
//           renderUserList(chatUsers)
//         ) : (
//           <div className="font-bold items-center flex flex-col text-xl text-yellow-500 mt-5">
//             <h1>Why are you alone... 🧐</h1>
//             <h1>Search username to chat.</h1>
//           </div>
//         )}
//       </div>

//       {/* Logout button (only show when not searching) */}
//       {searchResults.length === 0 && (
//         <div className="w-full px-4 py-3 border-t border-gray-200">
//           <button
//             onClick={HandleLogout}
//             className="w-full flex items-center gap-2 justify-center text-red-600 hover:text-white hover:bg-red-600 rounded-lg py-2 max-[375px]:mb-10 mb-6"
//           >
//             <BiLogOutCircle size={24} />
//             <span className="text-sm ">Logout</span>
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Sidebar;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi";
import { TbArrowBigLeftLinesFilled } from "react-icons/tb";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import userConversation from "../../zustand/useConversation";
import { useSocketContext } from "../../context/SocketContaxt";

const Sidebar = ({ onSelectUser }) => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageUsers, setNewMessageUsers] = useState("");
  const { onlineUser, socket } = useSocketContext();
  const {
    messages,
    setMessages,
    selectedConversation,
    setSelectedConversation,
  } = userConversation();

  // Check if the user is online
  const isOnline = (userId) => {
    return onlineUser.includes(userId);
  };

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setNewMessageUsers(newMessage);
    });
    return () => socket?.off("newMessage");
  }, [messages, socket]);

  useEffect(() => {
    const fetchChatUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/user/getcurrentchatter");
        if (res.data && Array.isArray(res.data)) {
          setChatUsers(res.data);
        } else {
          toast.info("No users found.");
        }
      } catch (err) {
        toast.error("Failed to fetch chat users.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatUsers();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setLoading(true);
    try {
      const res = await axios.get(`/api/user/search?search=${searchInput}`);
      if (res.data && Array.isArray(res.data)) {
        if (res.data.length === 0) {
          toast.info("User not found.");
        }
        setSearchResults(res.data);
      } else {
        toast.error("Unexpected response.");
      }
    } catch (err) {
      toast.error("Search failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user) => {
    onSelectUser(user);
    setSelectedConversation(user);
    setSelectedUserId(user._id);
    setNewMessageUsers("");
    // navigate(`/chat/${user._id}`); // optional: navigate to chat screen
  };

  const handleSearchBack = () => {
    setSearchResults([]);
    setSearchInput("");
  };

  const HandleLogout = async () => {
    const confirmLogout = window.prompt("Type 'UserName' To LOGOUT ");
    if (confirmLogout === authUser.username) {
      setLoading(true);
      try {
        const logout = await axios.post("/api/auth/logout");
        const data = logout.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        toast.info(data.message);
        localStorage.removeItem("chatapp");
        setAuthUser(null);
        setLoading(false);
        navigate("/login");
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    } else {
      toast.info("Logout Cancelled");
    }
  };

  const renderUserList = (users) => (
    <>
      <div className="w-auto overflow-y-auto max-h-[calc(100vh-60px)] pr-2">
        {users
          .filter((user) => user && user._id)
          .map((user) => (
            <div key={user._id}>
              <div
                onClick={() => handleUserClick(user)}
                className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${
                  selectedUserId === user._id ? "bg-sky-500" : ""
                }`}
              >
                {/* Avatar wrapper slightly bigger to allow space for dot */}
                <div className="relative w-[52px] h-[52px] flex items-center justify-center">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={user.profilepic}
                      alt="user"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Online Dot */}
                  {isOnline(user._id) && (
                    <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white z-10" />
                  )}
                </div>

                {/* Username */}
                <div className="flex flex-col flex-1">
                  <p className="font-bold text-gray-950">{user.username}</p>
                </div>
                <div>
                  {newMessageUsers.reciverId === authUser._id &&
                  newMessageUsers.senderId === user._id ? (
                    <div className="rounded-full bg-green-700 text-sm text-white px-[4px]">
                      +1
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              <div className="divider divide-solid px-3 h-[1px]"></div>
            </div>
          ))}
      </div>

      {/* Back Arrow */}
      {searchResults.length > 0 && (
        <div className="fixed bottom-4 left-6.5 transform -translate-x-1/2 z-50">
          <button
            onClick={handleSearchBack}
            className="bg-white rounded-full px-2 py-1 shadow"
          >
            <TbArrowBigLeftLinesFilled
              size={30}
              className="text-gray-700 hover:text-black cursor-pointer"
            />
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="relative h-screen w-auto px-1 flex flex-col">
      {/* Top section */}
      <div className="flex justify-between gap-2">
        <form
          onSubmit={handleSearch}
          className="w-auto flex items-center justify-between bg-white rounded-full"
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search user"
            className="px-4 w-auto text-black bg-transparent outline-none rounded-full"
          />
          <button
            type="submit"
            className="btn btn-circle bg-sky-700 hover:bg-gray-950"
          >
            <FaSearch />
          </button>
        </form>
        <img
          onClick={() => navigate(`/profile/${authUser._id}`)}
          src={authUser?.profilepic}
          className="self-center h-12 w-12 hover:scale-110 cursor-pointer rounded-full"
          alt="profile"
        />
      </div>

      <div className="divider px-3"></div>

      {/* Scrollable user list area */}
      <div className="flex-1 overflow-y-auto scrollbar">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : searchResults.length > 0 ? (
          renderUserList(searchResults)
        ) : chatUsers.length > 0 ? (
          renderUserList(chatUsers)
        ) : (
          <div className="font-bold items-center flex flex-col text-xl text-yellow-500 mt-5">
            <h1>Why are you alone... 🧐</h1>
            <h1>Search username to chat.</h1>
          </div>
        )}
      </div>

      {/* Logout button (only show when not searching) */}
      {searchResults.length === 0 && (
        <div className="w-full px-4 py-3 border-t border-gray-200">
          <button
            onClick={HandleLogout}
            className="w-full flex items-center gap-2 justify-center text-red-600 hover:text-white hover:bg-red-600 rounded-lg py-2 max-[375px]:mb-10 mb-6"
          >
            <BiLogOutCircle size={24} />
            <span className="text-sm ">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
