import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/axiosInstance";
import CodeEditor from "@/components/editor/CodeEditor";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const Playground: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [outputValue, setOutputValue] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("python");
  const [elapsedTime, setElapsedTime] = useState<number | null>(null);
  const [memoryUsage, setMemoryUsage] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [statusColor, setStatusColor] = useState<string>("");

  const navigate = useNavigate();

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
        return "py"; // default to Python if something goes wrong
    }
  };

  const handleRun = async () => {
    try {
      const mappedLanguage = mapLanguage(language);
      const response = await axiosInstance.post("/run", {
        source_code: code,
        input_data: inputValue,
        language: mappedLanguage,
      });

      const data = response.data;
      setOutputValue(data.stdout || data.stderr || "No output");
      setElapsedTime(data.elapsed_time);
      setMemoryUsage(data.memory_usage);

      setStatusMessage(data.message);
      setStatusColor(data.message === "Success" ? "green" : "red");
    } catch (error) {
      console.error("Error running code:", error);
      setOutputValue("An error occurred while running the code.");
      setStatusMessage("Error");
      setStatusColor("red");
    }
  };

  useEffect(() => {
    const storedUserName = sessionStorage.getItem("username");
    if (!storedUserName) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-[100vw] h-[80vh] rounded-lg border gap-[1.5px]"
    >
      <ResizablePanel
        defaultSize={50}
        className="rounded-[7px] border-[2px] border-[#555555]"
      >
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <CodeEditor onLanguageChange={setLanguage} onCodeChange={setCode} />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical" className="gap-[1.5px]">
          <ResizablePanel
            defaultSize={55}
            className="rounded-[7px] border-[2px] border-[#555555]"
          >
            <div className="flex flex-col h-full p-2 bg-black-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold mr-2">
                  Output
                  <span
                    className="ml-2"
                    style={{ color: statusColor }}
                  >
                    {statusMessage}
                  </span>
                </span>
                <Button
                  className="bg-[#423F3E] text-white px-4 py-2 rounded hover:bg-[#555555]"
                  size="sm"
                  onClick={handleRun}
                >
                  <Play size={16} className="mr-2" />
                  Run
                </Button>
              </div>
              <div
                className="w-full h-full p-2 border rounded bg-[#18181b] overflow-auto relative"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {outputValue}
                <div className="absolute bottom-2 left-2 right-2 flex justify-between text-sm text-gray-400">
                  <span>Elapsed Time: {elapsedTime !== null ? `${elapsedTime}s` : "N/A"}</span>
                  <span>Memory Usage: {memoryUsage !== null ? `${memoryUsage}MB` : "N/A"}</span>
                </div>
              </div>

            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={45}
            className="rounded-[7px] border-[2px] border-[#555555]"
          >
            <div className="flex flex-col h-full p-2 bg-black-200">
              <span className="font-semibold mb-2">Input</span>
              <textarea
                className="w-full h-full p-2 border rounded bg-[#2d2d2d] text-white"
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
