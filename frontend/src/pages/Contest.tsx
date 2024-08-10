import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Problems from "@/components/arena/Problems";
import Leaderboard from "@/components/battleground/Leaderboard";

const Contest: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = sessionStorage.getItem("username");
    if (!storedUserName) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <div className="flex justify-between p-4">
      <div className="w-1/2 pr-2">
        <Problems type="contest" />
      </div>
      <div className="w-1/2 pl-2">
        <Leaderboard />
      </div>
    </div>
  );
};

export default Contest;
