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
import { DialogClose } from "@radix-ui/react-dialog";

const AddProblem = () => {
  const [currentProblem, setCurrentProblem] = useState({
    title: "",
    statement: "",
    difficulty: "",
    constraints: "",
    testCases: [{ input: "", output: "" }],
  });

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
    setCurrentProblem({
      title: "",
      statement: "",
      difficulty: "",
      constraints: "",
      testCases: [{ input: "", output: "" }],
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-[#FFAD60] hover:bg-[#FFA250] flex items-center">
          Add Problem
          <ArrowUp size={16} className="ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0">
        <ScrollArea className="h-[40rem] p-5">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Add Problem</DialogTitle>
            <DialogDescription>
              Add a new problem to the list of available problems.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="problem-title" className="mb-1">
                Title
              </Label>
              <Input
                id="problem-title"
                className="w-11/12 ml-1"
                placeholder="Problem Title"
                value={currentProblem.title}
                onChange={(e) => handleInputChange(e, "title")}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="problem-statement" className="mb-1">
                Problem Statement
              </Label>
              <Textarea
                id="problem-statement"
                className="w-11/12 ml-1"
                placeholder="Problem Statement"
                value={currentProblem.statement}
                onChange={(e) => handleInputChange(e, "statement")}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="problem-difficulty" className="mb-1">
                Difficulty Level
              </Label>
              <Input
                id="problem-difficulty"
                className="w-11/12 ml-1"
                placeholder="Difficulty Level"
                value={currentProblem.difficulty}
                onChange={(e) => handleInputChange(e, "difficulty")}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="problem-constraints" className="mb-1">
                Constraints
              </Label>
              <Textarea
                id="problem-constraints"
                className="w-11/12 ml-1"
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
                  className="p-2 border border-gray-800 rounded-lg w-11/12 ml-1"
                >
                  <div className="space-y-1">
                    <Label
                      htmlFor={`test-case-input-${index}`}
                      className="mb-1"
                    >
                      Input
                    </Label>
                    <Textarea
                      id={`test-case-input-${index}`}
                      className="w-11/12 ml-1"
                      placeholder="Input"
                      value={testCase.input}
                      onChange={(e) =>
                        handleTestCaseChange(index, "input", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1 mt-2">
                    <Label
                      htmlFor={`test-case-output-${index}`}
                      className="mb-1"
                    >
                      Output
                    </Label>
                    <Textarea
                      id={`test-case-output-${index}`}
                      className="w-11/12 ml-1"
                      placeholder="Output"
                      value={testCase.output}
                      onChange={(e) =>
                        handleTestCaseChange(index, "output", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
              <Button onClick={addTestCase} className="mt-2">
                Add Test Case
              </Button>
            </div>
            <DialogClose asChild>
              <Button
                onClick={saveProblem}
                className="mt-4 w-full bg-[#FFAD60] hover:bg-[#FFA250]"
              >
                Add Problem
              </Button>
            </DialogClose>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddProblem;
