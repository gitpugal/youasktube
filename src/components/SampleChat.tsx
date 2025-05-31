import React from "react";

const SampleChat = () => {
  return (
    <div className="cursor-pointer group hover:shadow-2xl z-50 flex items-center gap-3 p-4 bg-yellow-500/5 backdrop-blur-md border shadow-lg rounded-xl text-sm md:w-1/2 md:mb-0 mb-5">
      <p className="font-light text-xs text-yellow-400">
        This is a <span className="font-semibold">sample chat</span>, feel free
        to play around and query from this chat
      </p>
    </div>
  );
};

export default SampleChat;
