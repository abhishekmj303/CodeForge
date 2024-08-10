import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, CloudUpload } from "lucide-react";
import axiosInstance from "@/axiosInstance";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InputOutputProps {
  problem_id: string;
  code: string;
  language: string;
}

interface TestCase {
  id: string;
  inputText: string;
  outputText: string;
}

interface Result {
  stdout: string;
  stderr: string;
  return_code: number;
  elapsed_time: number;
  memory_usage: number;
  timeout: boolean;
  test_passed: boolean;
  message: string;
}

interface SubmitResponse {
  is_solved: boolean;
  total_passed: number;
  elapsed_time: number;
  memory_used: number;
  results: Result[];
}

const sampleResponse: SubmitResponse = {
  is_solved: false,
  total_passed: 2,
  elapsed_time: 1234,
  memory_used: 5678,
  results: [
    {
      stdout: "Output 1",
      stderr: "",
      return_code: 0,
      elapsed_time: 500,
      memory_usage: 1024,
      timeout: false,
      test_passed: false,
      message: "First result",
    },
    {
      stdout: "Output 2",
      stderr: "",
      return_code: 0,
      elapsed_time: 400,
      memory_usage: 2048,
      timeout: false,
      test_passed: true,
      message: "Second result",
    },
    {
      stdout: "Output 3",
      stderr: "",
      return_code: 0,
      elapsed_time: 334,
      memory_usage: 512,
      timeout: false,
      test_passed: true,
      message: "Third result",
    },
  ],
};

const InputOutput: React.FC<InputOutputProps> = ({
  problem_id,
  code,
  language,
}) => {
  const [subResponse, setSubResponse] = useState<SubmitResponse | null>(null);
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

  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.post(`/problems/${problem_id}/submit`, {
        source_code: code,
        language: mapLanguage(language),
        username: sessionStorage.getItem("username"),
      });
      setSubResponse(response.data);
    } catch (error) {
      console.error("Error submitting code:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full overflow-auto bg-[#18181b] h-full overflow-hidden">
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
            className="bg-[#423F3E] text-green-500 px-4 py-2 rounded hover:bg-[#555555]"
            size="sm"
            onClick={handleSubmit}
          >
            <CloudUpload size={16} className="mr-2" />
            Submit
          </Button>
        </div>
      </div>
      <ScrollArea className="h-full">
        {subResponse && subResponse.is_solved ? (
          <div className="flex items-start justify-between p-4">
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-green-500">
                All test cases passed!
              </p>
              <p className="text-sm text-[#ffffff99]">
                Total test cases passed: {subResponse.total_passed}
              </p>
            </div>
            <div className="flex flex-col mr-10">
              <div className="flex flex-row text-sm text-[#ffffff99] gap-1">
                <p className="text-white">Execution Time:</p>
                <p>{subResponse ? `${subResponse.elapsed_time} ms` : "N/A"}</p>
              </div>
              <div className="flex flex-row text-sm text-[#ffffff99] gap-1">
                <p className="text-white">Memory Usage:</p>
                <p>{subResponse ? `${subResponse.memory_used} kb` : "N/A"}</p>
              </div>
            </div>
          </div>
        ) : subResponse && !subResponse.is_solved ? (
          <div className="flex items-start justify-between p-4">
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-red-500">
                Some test cases failed!
              </p>
              <p className="text-sm text-[#ffffff99]">
                Total test cases passed: {subResponse.total_passed}
              </p>
            </div>
            <div className="flex flex-col mr-10">
              <div className="flex flex-row text-sm text-[#ffffff99] gap-1">
                <p className="text-white">Execution Time:</p>
                <p>{subResponse ? `${subResponse.elapsed_time} ms` : "N/A"}</p>
              </div>
              <div className="flex flex-row text-sm text-[#ffffff99] gap-1">
                <p className="text-white">Memory Usage:</p>
                <p>{subResponse ? `${subResponse.memory_used} kb` : "N/A"}</p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex mt-4 px-4">
          {problem.examples
            .filter((example) => example.id !== "custom")
            .map((example, index) => (
              <div className="mr-2 mt-2 cursor-pointer" key={example.id}>
                <div className="flex items-center gap-y-4">
                  <div
                    className={`text-sm font-medium inline-flex items-center transition-all duration-300 rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap ${
                      activeTestCaseId === index
                        ? "bg-[#27272a] text-white"
                        : "bg-[#2d2d2d] text-gray-500"
                    }`}
                    onClick={() => setActiveTestCaseId(index)}
                  >
                    {subResponse ? (
                      subResponse.results[index]?.test_passed ? (
                        <span className="w-1 h-1 mr-2 bg-green-500 rounded-full inline-block"></span>
                      ) : (
                        <span className="w-1 h-1 mr-2 bg-red-500 rounded-full inline-block"></span>
                      )
                    ) : null}
                    Case {index + 1}
                  </div>
                </div>
              </div>
            ))}

          <div className="mr-2 mt-2 cursor-pointer">
            <div className="flex items-center gap-y-4">
              <div
                className={`text-sm font-medium inline-flex items-center transition-all duration-300 rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap ${
                  activeTestCaseId === problem.examples.length - 1
                    ? "bg-[#27272a] text-white"
                    : "bg-[#2d2d2d] text-gray-500"
                }`}
                onClick={() => setActiveTestCaseId(problem.examples.length - 1)}
              >
                Custom Input
              </div>
            </div>
          </div>
        </div>

        {problem.examples.map((example, index) =>
          activeTestCaseId === index ? (
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
                    Expected:
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
              {subResponse && (
                <>
                  <p className="text-sm font-medium mt-4 text-gray-500">
                    Run Output:
                  </p>
                  <textarea
                    className="w-full rounded-lg text-sm font-light border px-3 py-2 bg-[#27272a] border-transparent text-white mt-2"
                    value={
                      activeTestCaseId === problem.examples.length - 1
                        ? runOutput
                        : subResponse.results[activeTestCaseId]?.stdout || "No output"
                    }
                    readOnly
                  />
                </>
              )}
            </div>
          ) : null
        )}
      </ScrollArea>
    </div>
  );
};

export default InputOutput;
