import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"; // Adjust the import path based on your project structure

const Navbar: React.FC = () => {
  return (
    <div className="p-2 flex flex-row justify-between items-center shadow-md">
      <p className="text-2xl font-medium m-2">CodeForge</p>
      <NavigationMenu>
        <NavigationMenuList>
          {/* <NavigationMenuItem>
            <Link
              to="/"
              className={`${navigationMenuTriggerStyle()} text-[16px] font-medium`}
            >
              Home
            </Link>
          </NavigationMenuItem> */}
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
          {/* <NavigationMenuItem>
            <DropdownMenu>
              <NavigationMenuTrigger
                className={`${navigationMenuTriggerStyle()} text-[16px] font-medium`}
              >
                Account
              </NavigationMenuTrigger>
              <DropdownMenuContent>
                <Link to="/profile" className="flex items-center p-2">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </NavigationMenuItem> */}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default Navbar;
