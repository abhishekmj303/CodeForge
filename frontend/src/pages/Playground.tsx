import React, { useState } from "react";
import axios from "axios";
import CodeEditor from "@/components/editor/CodeEditor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const Playground: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [outputValue, setOutputValue] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");

  const mapLanguage = (language: string) => {
    switch (language) {
      case "javascript":
        return "js";
      case "python":
        return "py";
      case "c":
        return "c";
      case "cpp":
        return "cpp";
      default:
        return "js"; // default to JavaScript if something goes wrong
    }
  };

  const handleRun = async () => {
    try {
      console.log(code);
      console.log(language);
      console.log(inputValue);
      const mappedLanguage = mapLanguage(language);
      const response = await axios.post("http://127.0.0.1:8000/run", {
        source_code: code,
        input_data: inputValue,
        language: mappedLanguage,
      });

      const data = response.data;
      console.log(data);
      if (data.stderr) {
        setOutputValue(data.stderr);
      } else {
        setOutputValue(data.stdout);
      }
    } catch (error) {
      console.error("Error running code:", error);
      setOutputValue("An error occurred while running the code.");
    }
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-[100vw] h-[80vh] rounded-lg border"
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <CodeEditor
              onLanguageChange={setLanguage}
              onCodeChange={setCode}
            />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={55}>
            <div className="flex flex-col h-full p-2 bg-black-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold mr-2">Output</span>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={handleRun}
                >
                  Run
                </button>
              </div>
              <div
                className="w-full h-full p-2 border rounded bg-black overflow-auto"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {outputValue}
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={45}>
            <div className="flex flex-col h-full p-2 bg-black-200">
              <span className="font-semibold mb-2">Input</span>
              <textarea
                className="w-full h-full p-2 border rounded bg-gray-900 text-white"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter your input here..."
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Playground;
