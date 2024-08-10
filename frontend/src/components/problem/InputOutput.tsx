import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, CloudUpload } from "lucide-react";
import axiosInstance from "@/axiosInstance";

interface InputOutputProps {
  problem_id: string;
}

interface TestCase {
  id: string;
  inputText: string;
  outputText: string;
}

const InputOutput: React.FC<InputOutputProps> = ({ problem_id, code, language }) => {
  const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
  const [problem, setProblem] = useState<{ examples: TestCase[] }>({
    examples: [],
  });
  const [loading, setLoading] = useState(true);
  const [runOutput, setRunOutput] = useState<string>("");

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axiosInstance.get(`/problems/${problem_id}`);
        const fetchedTestCases = response.data.testcases.map(
          (testcase: any, index: number) => ({
            id: String(index + 1),
            inputText: testcase.input,
            outputText: testcase.output,
          })
        );

        setProblem({
          examples: [
            ...fetchedTestCases,
            { id: "custom", inputText: "", outputText: "" },
          ],
        });
      } catch (error) {
        console.error("Error fetching test cases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problem_id]);

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
    if (activeTestCaseId === problem.examples.length - 1) {
      const customInput = problem.examples[activeTestCaseId].inputText;
      try {
        const mappedLanguage = mapLanguage(language);
        const response = await axiosInstance.post("/run", {
          source_code: code, 
          input_data: customInput,
          language: mappedLanguage, 
          username: sessionStorage.getItem("username"),
        });
        setRunOutput(response.data.stdout || "No output");
      } catch (error) {
        console.error("Error running code:", error);
        setRunOutput("An error occurred");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
            onClick={handleRun}
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
                className="w-full rounded-lg text-sm font-light border px-3 py-2 bg-[#27272a] border-transparent text-white mt-2"
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
                    className="w-full rounded-lg text-sm font-light border px-3 py-2 bg-[#27272a] border-transparent text-white mt-2"
                    value={example.outputText}
                    onChange={(e) =>
                      handleOutputChange(example.id, e.target.value)
                    }
                    disabled
                  />
                </>
              )}
              {example.id === "custom" && (
                <>
                  <p className="text-sm font-medium mt-4 text-gray-500">
                    Run Output:
                  </p>
                  <textarea
                    className="w-full rounded-lg text-sm font-light border px-3 py-2 bg-[#27272a] border-transparent text-white mt-2"
                    value={runOutput}
                    readOnly
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
