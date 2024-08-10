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
import { ArrowUp, Pencil, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const AddProblem = () => {
  const [currentProblem, setCurrentProblem] = useState({
    title: "",
    statement: "",
    difficulty: "easy",
    constraints: "",
    testCases: [{ input: "", output: "" }],
  });

  const [editTestCaseIndex, setEditTestCaseIndex] = useState<number | null>(
    null
  );

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

  const handleEditTestCase = (index: number) => {
    setEditTestCaseIndex(index);
  };

  const saveTestCase = () => {
    setEditTestCaseIndex(null);
  };

  const handleDeleteTestCase = (index: number) => {
    setCurrentProblem((prev) => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index),
    }));
    if (editTestCaseIndex === index) setEditTestCaseIndex(null);
  };

  const saveProblem = () => {
    // Reset the problem form to default values
    setCurrentProblem({
      title: "",
      statement: "",
      difficulty: "easy",
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
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="problem-title" className="mb-1">
                Title
              </Label>
              <Input
                id="problem-title"
                className="w-full"
                placeholder="Problem Title"
                value={currentProblem.title}
                onChange={(e) => handleInputChange(e, "title")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="problem-statement" className="mb-1">
                Problem Statement
              </Label>
              <Textarea
                id="problem-statement"
                className="w-full"
                placeholder="Problem Statement"
                value={currentProblem.statement}
                onChange={(e) => handleInputChange(e, "statement")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="problem-difficulty" className="mb-1">
                Difficulty Level
              </Label>
              <RadioGroup
                defaultValue={currentProblem.difficulty}
                onValueChange={(value) =>
                  setCurrentProblem((prev) => ({ ...prev, difficulty: value }))
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="easy"
                    id="option-easy"
                    className="w-4 h-4 border border-gray-800 rounded-full checked:bg-[#14b8a6]"
                  />
                  <Label htmlFor="option-easy" className="text-[#14b8a6]">
                    Easy
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="medium"
                    id="option-medium"
                    className="w-4 h-4 border border-gray-800 rounded-full checked:bg-[#f59e0b]"
                  />
                  <Label htmlFor="option-medium" className="text-[#f59e0b]">
                    Medium
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="hard"
                    id="option-hard"
                    className="w-4 h-4 border border-gray-800 rounded-full checked:bg-[#ef4444]"
                  />
                  <Label htmlFor="option-hard" className="text-[#ef4444]">
                    Hard
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="problem-constraints" className="mb-1">
                Constraints
              </Label>
              <Textarea
                id="problem-constraints"
                className="w-full"
                placeholder="Constraints"
                value={currentProblem.constraints}
                onChange={(e) => handleInputChange(e, "constraints")}
              />
            </div>
            <div className="space-y-6 mt-4">
              <h3 className="font-semibold text-lg">Test Cases</h3>
              {currentProblem.testCases.map((testCase, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="space-y-2">
                    {editTestCaseIndex === index ? (
                      <>
                        <Label htmlFor={`test-input-${index}`}>Input</Label>
                        <Input
                          id={`test-input-${index}`}
                          placeholder="Test Case Input"
                          value={testCase.input}
                          onChange={(e) =>
                            handleTestCaseChange(index, "input", e.target.value)
                          }
                        />
                        <Label htmlFor={`test-output-${index}`}>Output</Label>
                        <Input
                          id={`test-output-${index}`}
                          placeholder="Test Case Output"
                          value={testCase.output}
                          onChange={(e) =>
                            handleTestCaseChange(
                              index,
                              "output",
                              e.target.value
                            )
                          }
                        />
                        <Button
                          size="sm"
                          className="mt-2 w-full bg-[#14b8a6] text-white hover:bg-[#059669]"
                          onClick={saveTestCase}
                        >
                          Save Test Case
                        </Button>
                      </>
                    ) : (
                      <>
                        <p>
                          <strong>Input:</strong> {testCase.input}
                        </p>
                        <p>
                          <strong>Output:</strong> {testCase.output}
                        </p>
                        <div className="flex space-x-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditTestCase(index)}
                          >
                            Edit
                            <Pencil size={16} className="ml-2" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            color="red"
                            onClick={() => handleDeleteTestCase(index)}
                          >
                            Delete
                            <Trash2 size={16} className="ml-2" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
              <Button
                size="sm"
                className="mt-2 w-full bg-[#FFAD60] text-white hover:bg-[#FFA250]"
                onClick={addTestCase}
              >
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
