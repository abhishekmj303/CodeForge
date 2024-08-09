import React, { useState } from "react";
import CodeEditor from "@/components/editor/CodeEditor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const Playground: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [outputValue, setOutputValue] = useState<string>("");

  const handleRun = () => {
    // Implement the logic for running the code
    // For now, just displaying the input value in the output
    setOutputValue(inputValue);
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-[100vw] h-[80vh] rounded-lg border"
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <CodeEditor />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
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
          <ResizableHandle />
          <ResizablePanel defaultSize={45}>
            <div className="flex flex-col h-full p-2 bg-black-200">
              <span className="font-semibold mb-2">Input</span>
              <textarea
                className="w-full h-full p-2 border rounded bg-gray-900 text-white"
                value={inputValue}
                color="black"
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
