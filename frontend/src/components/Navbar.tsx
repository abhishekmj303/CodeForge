import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"; // Adjust the import path based on your project structure

const Navbar: React.FC = () => {
  const [storedUserName, setStoredUserName] = useState<string | null>(null);

  useEffect(() => {
    // Check for the username in session storage initially
    const username = sessionStorage.getItem("username");
    setStoredUserName(username);

    // Listen for changes in sessionStorage
    const handleStorageChange = () => {
      const updatedUsername = sessionStorage.getItem("username");
      setStoredUserName(updatedUsername);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="p-2 flex flex-row justify-between items-center shadow-md">
      <Link to="/" className="">
        <p className="text-2xl font-medium m-2">CodeForge</p>
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link
              to="/playground"
              className={`${navigationMenuTriggerStyle()} text-[16px] font-medium`}
            >
              Playground
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              to="/arena"
              className={`${navigationMenuTriggerStyle()} text-[16px] font-medium`}
            >
              Arena
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              to="/battleground"
              className={`${navigationMenuTriggerStyle()} text-[16px] font-medium`}
            >
              Battleground
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {storedUserName && (
        <p className="text-lg font-medium m-2">{storedUserName}</p>
      )}
    </div>
  );
};

export default Navbar;
