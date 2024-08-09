import { useRef, useState, FC } from "react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import ThemeSelector from "./ThemeSelector";
import * as monaco from 'monaco-editor';

const THEMES = {
  'vs-dark': 'Visual Studio Dark',
  light: 'Light',
} as const;

type Theme = keyof typeof THEMES;
type Language = 'javascript' | 'typescript' | 'python' | 'java' | 'csharp' | 'php';

const CodeEditor: FC = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [value, setValue] = useState<string>("");
  const [language, setLanguage] = useState<Language>("javascript");
  const [theme, setTheme] = useState<Theme>("vs-dark");

  const CODE_SNIPPETS: Record<Language, string> = {
    javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
    typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
    python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
    java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
    csharp:
      'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
    php: "<?php\n\n$name = 'Alex';\necho $name;\n",
  };

  const onMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelectLanguage = (language: Language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const onSelectTheme = (theme: Theme) => {
    setTheme(theme);
  };

  return (
    <div className="relative flex flex-col h-screen">
    <div className="flex justify-between p-2 bg-gray-900 text-white">
      <LanguageSelector language={language} onSelect={onSelectLanguage} />
      <ThemeSelector theme={theme} onSelect={onSelectTheme} />
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
        onChange={(value) => setValue(value || "")}
      />
    </div>
  </div>
  );
};

export default CodeEditor;
