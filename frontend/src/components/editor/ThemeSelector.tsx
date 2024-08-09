import { FC } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";

const THEMES = {
  'vs-dark': 'Visual Studio Dark',
  light: 'Light',
} as const;

type Theme = keyof typeof THEMES;

interface ThemeSelectorProps {
  theme: Theme;
  onSelect: (theme: Theme) => void;
}

const ThemeSelector: FC<ThemeSelectorProps> = ({ theme, onSelect }) => {
  const themes = Object.entries(THEMES);

  return (
    <div className="flex items-center">
      <p className="mr-2">Theme:</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>{THEMES[theme]}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-900 text-white">
          {themes.map(([key, name]) => (
            <DropdownMenuItem
              key={key}
              className={`hover:bg-gray-800 ${key === theme ? "bg-gray-800" : ""}`}
              onClick={() => onSelect(key as Theme)}
            >
              {name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ThemeSelector;
