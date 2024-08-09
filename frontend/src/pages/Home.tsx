import React from "react";
import NavigationCard from "@/components/NavigationCard"; // Adjust import path as necessary

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
    </div>
  );
};

export default Home;
