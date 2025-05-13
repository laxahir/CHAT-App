import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MessageData from "./components/MessageData";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebar, setIsSidebar] = useState(true);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsSidebar(false);
  };

  const handleShowSidebar = () => {
    setIsSidebar(true);
    setSelectedUser(null);
  };

  return (
    <div className="flex justify-between min-w-full md:min-w-[750px] md:max-w-[75%] px-2 h-[95%] md:h-full rounded-xl shadow-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      {/* ----- */}
      <div className={`w-full py-2 md:flex ${isSidebar ? "" : "hidden"}`}>
        <Sidebar onSelectUser={handleUserSelect} />
      </div>
      <div
        className={`divider divider-horizontal px-3 md:flex ${
          isSidebar ? "" : "hidden"
        } ${selectedUser ? "block" : "hidden"}`}
      ></div>
      <div className={`flex-auto ${selectedUser ? "" : "hidden md:flex"}`}>
        <MessageData onBackUser={handleShowSidebar} />
      </div>
      {/* ----- */}
    </div>
  );
};

export default Home;
