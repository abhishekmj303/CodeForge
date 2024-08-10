import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2 } from 'lucide-react';
import { Pencil } from 'lucide-react';
import { ArrowUp } from "lucide-react";


export default function AddContestPage() {
  const [contestDetails, setContestDetails] = useState({
    title: "",
    details: "",
  });
  const [problems, setProblems] = useState([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [currentProblem, setCurrentProblem] = useState({
    title: "",
    statement: "",
    difficulty: "Easy",
    constraints: "",
    testCases: [{ input: "", output: "" }],
  });
  const [isEditingDetails, setIsEditingDetails] = useState(true);
  const [editTestCaseIndex, setEditTestCaseIndex] = useState<number | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setCurrentProblem({ ...currentProblem, [field]: e.target.value });
  };

  const handleDifficultyChange = (value: string) => {
    setCurrentProblem({ ...currentProblem, difficulty: value });
  };

  const handleTestCaseChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newTestCases = [...currentProblem.testCases];
    newTestCases[index][field] = value;
    setCurrentProblem({ ...currentProblem, testCases: newTestCases });
  };

  const saveProblem = () => {
    if (editIndex !== null) {
      const newProblems = [...problems];
      newProblems[editIndex] = currentProblem;
      setProblems(newProblems);
      setEditIndex(null);
    } else {
      setProblems([...problems, currentProblem]);
    }
    setCurrentProblem({
      title: "",
      statement: "",
      difficulty: "Easy",
      constraints: "",
      testCases: [{ input: "", output: "" }],
    });
  };

  const addTestCase = () => {
    setCurrentProblem({
      ...currentProblem,
      testCases: [...currentProblem.testCases, { input: "", output: "" }],
    });
  };

  const handleEditProblem = (index: number) => {
    setEditIndex(index);
    setCurrentProblem(problems[index]);
  };

  const saveContestDetails = () => {
    setIsEditingDetails(false);
  };

  const editContestDetails = () => {
    setIsEditingDetails(true);
  };

  const handleDeleteProblem = (index: number) => {
    const newProblems = problems.filter((_, i) => i !== index);
    setProblems(newProblems);
  };

  const handleEditTestCase = (index: number) => {
    setEditTestCaseIndex(index);
  };

  const saveTestCase = () => {
    setEditTestCaseIndex(null);
  };

  const handleDeleteTestCase = (index: number) => {
    const newTestCases = currentProblem.testCases.filter((_, i) => i !== index);
    setCurrentProblem({ ...currentProblem, testCases: newTestCases });
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8">Add New Contest</h1>
      <Tabs defaultValue="details" className="w-[800px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Contest Details</TabsTrigger>
          <TabsTrigger value="problems">Problems</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Contest Details</CardTitle>
              <CardDescription>
                Provide details about the contest.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[300px] overflow-auto">
              {isEditingDetails ? (
                <>
                  <div className="space-y-1">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Contest Title"
                      value={contestDetails.title}
                      onChange={(e) =>
                        setContestDetails({
                          ...contestDetails,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="details">Details</Label>
                    <Textarea
                      id="details"
                      placeholder="Contest Details"
                      value={contestDetails.details}
                      onChange={(e) =>
                        setContestDetails({
                          ...contestDetails,
                          details: e.target.value,
                        })
                      }
                    />
                  </div>
                  <CardFooter>
                    <Button onClick={saveContestDetails} className="w-full">
                      Save Contest Details
                    </Button>
                  </CardFooter>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    <p><strong>Title:</strong> {contestDetails.title}</p>
                    <p><strong>Details:</strong> {contestDetails.details}</p>
                  </div>
                  <CardFooter>
                    <Button onClick={editContestDetails} className="w-full">
                      Edit
                    </Button>
                  </CardFooter>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="problems">
          <Card>
            <CardHeader>
              <CardTitle>Problems</CardTitle>
              <CardDescription>
                Add the problems for this contest.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[900px] overflow-auto">
              {problems.map((problem, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h2 className="font-semibold mb-2">
                    Problem {index + 1}
                    <div className="flex space-x-2 mt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditProblem(index)}
                      >
                        Edit
                        <Pencil size={16} className="ml-2"/>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        color="red"
                        onClick={() => handleDeleteProblem(index)}
                      >
                        Delete
                        <Trash2 size={16} className="ml-2"/>
                      </Button>
                    </div>
                  </h2>
                  <div className="space-y-1">
                    <p><strong>Title:</strong> {problem.title}</p>
                    <p><strong>Statement:</strong> {problem.statement}</p>
                    <p><strong>Difficulty Level:</strong> {problem.difficulty}</p>
                    <p><strong>Constraints:</strong> {problem.constraints}</p>
                    <h3 className="font-semibold mt-2">Test Cases</h3>
                    {problem.testCases.map((testCase, testCaseIndex) => (
                      <div key={testCaseIndex} className="p-2 border rounded-lg mt-2">
                        <div className="space-y-1">
                          <p><strong>Input:</strong> {testCase.input}</p>
                          <p><strong>Output:</strong> {testCase.output}</p>
                        </div>
                        {/* <div className="flex space-x-2 mt-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditTestCase(testCaseIndex)}
                          >
                            Edit
                            <Pencil size={16} className="ml-2"/>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            color="red"
                            onClick={() => handleDeleteTestCase(testCaseIndex)}
                          >
                            Delete
                            <Trash2 size={16} className="ml-2"/>
                          </Button>
                        </div> */}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="p-4 border rounded-lg">
                <h2 className="font-semibold mb-2">
                  {editIndex !== null ? "Edit Problem" : "Add Problem"}
                </h2>
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
                  <Label>Difficulty Level</Label>
                <RadioGroup
                    value={currentProblem.difficulty}
                    onValueChange={handleDifficultyChange}
                >
                    <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Easy" id="easy" />
                    <Label htmlFor="easy">Easy</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Medium" id="medium" />
                    <Label htmlFor="medium">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Difficult" id="difficult" />
                    <Label htmlFor="difficult">Difficult</Label>
                    </div>
                </RadioGroup>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="problem-constraints">Constraints</Label>
                  <Textarea
                    id="problem-constraints"
                    placeholder="Problem Constraints"
                    value={currentProblem.constraints}
                    onChange={(e) => handleInputChange(e, "constraints")}
                  />
                </div>
                <div className="space-y-4 mt-4">
                  <h3 className="font-semibold">Test Cases</h3>
                  {currentProblem.testCases.map((testCase, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="space-y-1">
                        {editTestCaseIndex === index ? (
                          <>
                            <Label htmlFor={`test-input-${index}`}>
                              Input
                            </Label>
                            <Input
                              id={`test-input-${index}`}
                              placeholder="Test Case Input"
                              value={testCase.input}
                              onChange={(e) =>
                                handleTestCaseChange(index, "input", e.target.value)
                              }
                            />
                            <Label htmlFor={`test-output-${index}`}>
                              Output
                            </Label>
                            <Input
                              id={`test-output-${index}`}
                              placeholder="Test Case Output"
                              value={testCase.output}
                              onChange={(e) =>
                                handleTestCaseChange(index, "output", e.target.value)
                              }
                            />
                            <Button
                              size="sm"
                              className="mt-2"
                              onClick={saveTestCase}
                            >
                              Save Test Case
                            </Button>
                          </>
                        ) : (
                          <>
                            <p><strong>Input:</strong> {testCase.input}</p>
                            <p><strong>Output:</strong> {testCase.output}</p>
                            <div className="flex space-x-2 mt-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditTestCase(index)}
                              >
                                Edit
                                <Pencil size={16} className="ml-2"/>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                color="red"
                                onClick={() => handleDeleteTestCase(index)}
                              >
                                Delete
                                <Trash2 size={16} className="ml-2"/>
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button size="sm" onClick={addTestCase}>
                    Add Test Case
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveProblem} className="w-full">
                {editIndex !== null ? "Update Problem" : "Add Problem"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      <Button className="bg-[#FFAD60] hover:bg-[#FFA250] flex items-center m-4">
        Post Contest
        <ArrowUp size={16} className="ml-2" />
      </Button>
    </div>
  );
}

