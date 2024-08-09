import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const AddProblem = () => {
  const [problems, setProblems] = useState<any[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentProblem, setCurrentProblem] = useState<any>({
    title: "",
    statement: "",
    difficulty: "",
    constraints: "",
    testCases: [{ input: "", output: "" }],
  });

  const handleEditProblem = (index: number) => {
    setCurrentProblem(problems[index]);
    setEditIndex(index);
  };

  const handleDeleteProblem = (index: number) => {
    setProblems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setCurrentProblem((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleTestCaseChange = (
    index: number,
    field: "input" | "output",
    value: string
  ) => {
    const updatedTestCases = currentProblem.testCases.map((testCase, i) =>
      i === index ? { ...testCase, [field]: value } : testCase
    );
    setCurrentProblem((prev) => ({ ...prev, testCases: updatedTestCases }));
  };

  const addTestCase = () => {
    setCurrentProblem((prev) => ({
      ...prev,
      testCases: [...prev.testCases, { input: "", output: "" }],
    }));
  };

  const saveProblem = () => {
    if (editIndex !== null) {
      setProblems((prev) =>
        prev.map((problem, i) => (i === editIndex ? currentProblem : problem))
      );
    } else {
      setProblems((prev) => [...prev, currentProblem]);
    }
    setCurrentProblem({
      title: "",
      statement: "",
      difficulty: "",
      constraints: "",
      testCases: [{ input: "", output: "" }],
    });
    setEditIndex(null);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-[#FFAD60] hover:bg-[#FFA250] flex items-center">
          Add Problem
          <ArrowUp size={16} className="ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <ScrollArea className="h-[40rem] p-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editIndex !== null ? "Edit Problem" : "Add Problem"}
            </DialogTitle>
            <DialogDescription>
              {editIndex !== null
                ? "Modify the details of the selected problem."
                : "Add a new problem to the list of available problems."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {problems.map((problem, index) => (
              <div
                key={index}
                className="p-4 border border-gray-300 rounded-lg"
              >
                <h2 className="text-lg font-semibold mb-2">
                  Problem {index + 1}
                </h2>
                <div className="flex space-x-2 mb-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditProblem(index)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    color="red"
                    onClick={() => handleDeleteProblem(index)}
                  >
                    Delete
                  </Button>
                </div>
                <div className="space-y-2">
                  <p>
                    <strong>Title:</strong> {problem.title}
                  </p>
                  <p>
                    <strong>Statement:</strong> {problem.statement}
                  </p>
                  <p>
                    <strong>Difficulty Level:</strong> {problem.difficulty}
                  </p>
                  <p>
                    <strong>Constraints:</strong> {problem.constraints}
                  </p>
                  <h3 className="text-lg font-semibold mt-2">Test Cases</h3>
                  {problem.testCases.map((testCase, testCaseIndex) => (
                    <div key={testCaseIndex} className="pl-4">
                      <p>
                        <strong>Input:</strong> {testCase.input}
                      </p>
                      <p>
                        <strong>Output:</strong> {testCase.output}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="">
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="problem-title">Title</Label>
                  <Input
                    id="problem-title"
                    placeholder="Problem Title"
                    value={currentProblem.title}
                    onChange={(e) => handleInputChange(e, "title")}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="problem-statement">Problem Statement</Label>
                  <Textarea
                    id="problem-statement"
                    placeholder="Problem Statement"
                    value={currentProblem.statement}
                    onChange={(e) => handleInputChange(e, "statement")}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="problem-difficulty">Difficulty Level</Label>
                  <Input
                    id="problem-difficulty"
                    placeholder="Difficulty Level"
                    value={currentProblem.difficulty}
                    onChange={(e) => handleInputChange(e, "difficulty")}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="problem-constraints">Constraints</Label>
                  <Textarea
                    id="problem-constraints"
                    placeholder="Constraints"
                    value={currentProblem.constraints}
                    onChange={(e) => handleInputChange(e, "constraints")}
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Test Cases</h3>
                  {currentProblem.testCases.map((testCase, index) => (
                    <div
                      key={index}
                      className="p-2 border border-gray-300 rounded-lg"
                    >
                      <div className="space-y-1">
                        <Label htmlFor={`test-case-input-${index}`}>
                          Input
                        </Label>
                        <Textarea
                          id={`test-case-input-${index}`}
                          placeholder="Input"
                          value={testCase.input}
                          onChange={(e) =>
                            handleTestCaseChange(index, "input", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-1 mt-2">
                        <Label htmlFor={`test-case-output-${index}`}>
                          Output
                        </Label>
                        <Textarea
                          id={`test-case-output-${index}`}
                          placeholder="Output"
                          value={testCase.output}
                          onChange={(e) =>
                            handleTestCaseChange(
                              index,
                              "output",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                  <Button onClick={addTestCase} className="mt-2">
                    Add Test Case
                  </Button>
                </div>
              </div>
            </div>
            <Button
              onClick={saveProblem}
              className="mt-4 w-full bg-[#FFAD60] hover:bg-[#FFA250]"
            >
              {editIndex !== null ? "Save Changes" : "Add Problem"}
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddProblem;
