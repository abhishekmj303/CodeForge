import React from "react";
import Problems from "@/components/arena/Problems";
import Leaderboard from "@/components/battleground/Leaderboard";

const Contest: React.FC = () => {
  return (
    <div className="flex justify-between p-4">
      <div className="w-1/2 pr-2">
        <Problems />
      </div>
      <div className="w-1/2 pl-2">
        <Leaderboard />
      </div>
    </div>
  );
};

export default Contest;
