import { useRef, useState, useEffect, FC } from "react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import ThemeSelector from "./ThemeSelector";
import * as monaco from "monaco-editor";

const THEMES = {
  "vs-dark": "Visual Studio Dark",
  light: "Light",
} as const;

type Theme = keyof typeof THEMES;
type Language = "javascript" | "python" | "c" | "cpp";

interface CodeEditorProps {
  onLanguageChange: (language: Language) => void;
  onCodeChange: (code: string) => void;
}

const CodeEditor: FC<CodeEditorProps> = ({
  onLanguageChange,
  onCodeChange,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [value, setValue] = useState<string>("");
  const [language, setLanguage] = useState<Language>("python");
  const [theme, setTheme] = useState<Theme>("vs-dark");

  const CODE_SNIPPETS: Record<Language, string> = {
    javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
    python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
    c: `\n#include <stdio.h>\n\nint main() {\n\tprintf("Hello, World!\\n");\n\treturn 0;\n}\n`,
    cpp: `\n#include <iostream>\n\nint main() {\n\tstd::cout << "Hello, World!" << std::endl;\n\treturn 0;\n}\n`,
  };

  useEffect(() => {
    const initialCode = CODE_SNIPPETS[language];
    setValue(initialCode);
    onCodeChange(initialCode);
  }, [language]);

  const onMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelectLanguage = (language: Language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
    onLanguageChange(language);
  };

  const onSelectTheme = (theme: Theme) => {
    setTheme(theme);
  };

  const handleCodeChange = (value: string | undefined) => {
    setValue(value || "");
    onCodeChange(value || "");
  };

  return (
    <div className="relative flex flex-col h-screen">
      <div className="flex justify-between p-2 bg-[#2d2d2d] text-white">
        <ThemeSelector theme={theme} onSelect={onSelectTheme} />
        <LanguageSelector language={language} onSelect={onSelectLanguage} />
      </div>
      <div className="flex-1">
        <Editor
          options={{
            minimap: {
              enabled: false,
            },
          }}
          height="calc(100vh - 60px)"
          theme={theme}
          language={language}
          defaultValue={CODE_SNIPPETS[language]}
          onMount={onMount}
          value={value}
          onChange={handleCodeChange}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
