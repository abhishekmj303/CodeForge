import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, CloudUpload } from "lucide-react";

const InputOutput: React.FC = () => {
  const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);

  const [problem, setProblem] = useState({
    examples: [
      {
        id: "1",
        inputText: "2,7,11,15",
        outputText: "0,1",
      },
      {
        id: "2",
        inputText: "3,2,4",
        outputText: "1,2",
      },
      {
        id: "3",
        inputText: "3,3",
        outputText: "0,1",
      },
      {
        id: "custom",
        inputText: "",
        outputText: "",
      },
    ],
  });

  const handleInputChange = (id: string, newInput: string) => {
    setProblem((prev) => ({
      ...prev,
      examples: prev.examples.map((example) =>
        example.id === id ? { ...example, inputText: newInput } : example
      ),
    }));
  };

  const handleOutputChange = (id: string, newOutput: string) => {
    setProblem((prev) => ({
      ...prev,
      examples: prev.examples.map((example) =>
        example.id === id ? { ...example, outputText: newOutput } : example
      ),
    }));
  };

  return (
    <div className="w-full overflow-auto bg-[#18181b] h-full ">
      <div className="flex py-7 px-5 h-10 items-center justify-between space-x-6 bg-[#2d2d2d]">
        <div className="text-md font-medium leading-5 text-white">
          Testcases
        </div>
        <div className="flex gap-1">
          <Button
            className="bg-[#423F3E] text-white px-4 py-2 rounded hover:bg-[#555555]"
            size="sm"
          >
            <Play size={16} className="mr-2" />
            Run
          </Button>
          <Button
            className="bg-[#423F3E] text-green-600 px-4 py-2 rounded hover:bg-[#555555]"
            size="sm"
          >
            <CloudUpload size={16} className="mr-2" />
            Submit
          </Button>
        </div>
      </div>

      <div className="flex mt-4 px-4">
        {problem.examples
          .filter((example) => example.id !== "custom")
          .map((example, index) => (
            <div className="mr-2 mt-2 cursor-pointer" key={example.id}>
              <div className="flex items-center gap-y-4">
                <div
                  className={`text-sm font-medium inline-flex items-center transition-all duration-300 rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
                    ${
                      activeTestCaseId === index
                        ? "bg-[#27272a] text-white"
                        : "bg-[#2d2d2d] text-gray-500"
                    }
                  `}
                  onClick={() => setActiveTestCaseId(index)}
                >
                  Case {index + 1}
                </div>
              </div>
            </div>
          ))}

        <div className="mr-2 mt-2 cursor-pointer">
          <div className="flex items-center gap-y-4">
            <div
              className={`text-sm font-medium inline-flex items-center transition-all duration-300 rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
                ${
                  activeTestCaseId === problem.examples.length - 1
                    ? "bg-[#27272a] text-white"
                    : "bg-[#2d2d2d] text-gray-500"
                }
              `}
              onClick={() => setActiveTestCaseId(problem.examples.length - 1)}
            >
              Custom Input
            </div>
          </div>
        </div>
      </div>

      {problem.examples.map(
        (example, index) =>
          activeTestCaseId === index && (
            <div key={example.id} className="font-semibold my-4 px-4">
              <p className="text-sm font-medium mt-4 text-gray-500">Input:</p>
              <textarea
                className="w-full rounded-lg border px-3 py-2 bg-[#27272a] border-transparent text-white mt-2"
                value={example.inputText}
                onChange={(e) => handleInputChange(example.id, e.target.value)}
                disabled={example.id !== "custom"}
              />
              {example.id !== "custom" && (
                <>
                  <p className="text-sm font-medium mt-4 text-gray-500">
                    Output:
                  </p>
                  <textarea
                    className="w-full rounded-lg border px-3 py-2 bg-[#27272a] border-transparent text-white mt-2"
                    value={example.outputText}
                    onChange={(e) =>
                      handleOutputChange(example.id, e.target.value)
                    }
                    disabled
                  />
                </>
              )}
            </div>
          )
      )}
    </div>
  );
};

export default InputOutput;
