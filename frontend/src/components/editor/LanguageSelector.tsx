import { FC } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";

type Language = 'javascript' | 'typescript' | 'python' | 'java' | 'csharp' | 'php';

interface LanguageSelectorProps {
  language: Language;
  onSelect: (language: Language) => void;
}

const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  csharp: "6.12.0",
  php: "8.2.3",
};

const languages = Object.entries(LANGUAGE_VERSIONS) as [Language, string][];

const ACTIVE_COLOR = "text-blue-400";

const LanguageSelector: FC<LanguageSelectorProps> = ({ language, onSelect }) => {
  return (
    <div className="ml-2 mb-4">
      <p className="mb-2 text-lg">Language:</p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">{language}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-900 text-white">
          {languages.map(([lang, version]) => (
            <DropdownMenuItem
              key={lang}
              className={`hover:bg-gray-800 ${lang === language ? "bg-gray-800" : ""}`}
              onClick={() => onSelect(lang)}
            >
              <span className={`${lang === language ? ACTIVE_COLOR : ""}`}>
                {lang}
              </span>
              &nbsp;
              <span className="text-gray-600 text-sm">({version})</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSelector;
