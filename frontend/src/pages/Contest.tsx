import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Problems from "@/components/arena/Problems";
import Leaderboard from "@/components/battleground/Leaderboard";
import { useParams } from "react-router-dom";
// import axiosInstance from "@/axiosInstance";

const Contest: React.FC = () => {
  const navigate = useNavigate();
  // get the contest id from the URL
  const { contest_code } = useParams<{ contest_code: string }>();

  console.log(contest_code);

  useEffect(() => {
    const storedUserName = sessionStorage.getItem("username");
    if (!storedUserName) {
      navigate("/");
    }
  }, [navigate, contest_code]);
  return (
    <div className="flex justify-between p-4">
      <div className="w-1/2 pr-2">
        <Problems type="contest" contest_code={contest_code} />
      </div>
      <div className="w-1/2 pl-2">
        <Leaderboard contest_code={contest_code} />
      </div>
    </div>
  );
};

export default Contest;
