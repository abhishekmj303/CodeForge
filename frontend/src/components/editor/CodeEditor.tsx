import { useRef, useState, useEffect, FC } from "react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import ThemeSelector from "./ThemeSelector";
import * as monaco from 'monaco-editor';

// Define the available themes
const THEMES = {
  'mocha': 'Custom Dark',
  'vs-dark': 'Visual Studio Dark',
  light: 'Light',
} as const;

// Define the type for Theme
type Theme = keyof typeof THEMES;
type Language = 'javascript' | 'typescript' | 'python' | 'java' | 'csharp' | 'php';

const CodeEditor: FC = () => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [value, setValue] = useState<string>("");
  const [language, setLanguage] = useState<Language>("javascript");
  const [theme, setTheme] = useState<Theme>("mocha");

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

  useEffect(() => {
    monaco.editor.defineTheme('mocha', {
      base: 'vs-dark', // using 'vs-dark' as the base for a dark theme
      inherit: true, // inherit from the base theme
      rules: [
          { token: 'comment', foreground: 'd4af79', fontStyle: 'italic' }, 
          { token: 'keyword', foreground: 'e08c75', fontStyle: 'bold' },
          { token: 'string', foreground: 'a3be8c' }, 
          { token: 'number', foreground: 'b48ead' }, 
          { token: 'identifier', foreground: 'ebcb8b' }, 
          { token: 'delimiter', foreground: '8fbcbb' }, 
          { token: 'type', foreground: 'd08770' },
      ],
      colors: {
          'editor.background': '#3B3228', // Mocha-like dark brown
          'editor.foreground': '#F5F5DC', // Mocha-like beige
          'editorCursor.foreground': '#F8F8F2', // Light cursor color
          'editorLineNumber.foreground': '#756b5e', // Mocha-like muted brown
          'editor.selectionBackground': '#5a4b3f', // Mocha-like selection color
          'editor.inactiveSelectionBackground': '#4e4238', // Mocha-like inactive selection color
          // add more editor colors here
      },
  });
  }, []);

  const onSelectLanguage = (language: Language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const onSelectTheme = (theme: Theme) => {
    setTheme(theme);
  };

  return (
    <div className="flex space-x-4">
      <LanguageSelector language={language} onSelect={onSelectLanguage} />
      <ThemeSelector theme={theme} onSelect={onSelectTheme} />
      <Editor
        options={{
          minimap: {
            enabled: false,
          },
        }}
        height="75vh"
        theme={theme}
        language={language}
        defaultValue={CODE_SNIPPETS[language]}
        onMount={onMount}
        value={value}
        onChange={(value) => setValue(value || "")}
      />
    </div>
  );
};

export default CodeEditor;
