import React, { useState, useEffect } from "react";
import NavigationCard from "@/components/NavigationCard"; // Adjust import path as necessary
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// Define the card data
const cardData = [
  {
    title: "Playground",
    details: [
      "Write and execute code",
      "See performance metrics",
      "Test with custom inputs",
      "View code output",
      "Debug with error messages",
    ],
    route: "/playground",
    color: "#FFAD60",
  },
  {
    title: "Arena",
    details: [
      "Solve coding problems",
      "Upload your own problems",
      "Practice coding skills",
      "Define problem constraints",
      "Add test cases",
    ],
    route: "/arena",
    color: "#FF4C4C",
  },
  {
    title: "Battleground",
    details: [
      "Participate in contests",
      "View real-time leaderboards",
      "Host your own contests",
      "Challenge other users",
      "Compete in various modes",
    ],
    route: "/battleground",
    color: "#1d4ed8",
  },
];

const Home: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [tempUserName, setTempUserName] = useState("");

  useEffect(() => {
    const storedUserName = sessionStorage.getItem("username");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const handleSubmit = () => {
    if (tempUserName.trim() === "") {
      return;
    }
    setUserName(tempUserName);
    sessionStorage.setItem("username", tempUserName);
    setTempUserName("");
  };

  return (
    <div className="card-container">
      {cardData.map((card, index) => (
        <NavigationCard
          key={index}
          title={card.title}
          details={card.details}
          route={card.route}
          color={card.color}
        />
      ))}

      {userName === "" && (
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Welcome!</DialogTitle>
              <DialogDescription>
                Please provide a username to continue.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-row items-center gap-2 mt-2">
              <Input
                type="text"
                id="username"
                placeholder="Username"
                value={tempUserName}
                onChange={(e) => setTempUserName(e.target.value)}
                className="grow"
              />
              <Button
                onClick={handleSubmit}
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                Submit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Home;
