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
    difficulty: "",
    constraints: "",
    testCases: [{ input: "", output: "" }],
  });
  const [isEditingDetails, setIsEditingDetails] = useState(true);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setCurrentProblem({ ...currentProblem, [field]: e.target.value });
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
      difficulty: "",
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
                </h2>
                <div className="space-y-1">
                    <p><strong>Title:</strong> {problem.title}</p>
                    <p><strong>Statement:</strong> {problem.statement}</p>
                    <p><strong>Difficulty Level:</strong> {problem.difficulty}</p>
                    <p><strong>Constraints:</strong> {problem.constraints}</p>
                    <h3 className="font-semibold mt-2">Test Cases</h3>
                    {problem.testCases.map((testCase, testCaseIndex) => (
                    <div key={testCaseIndex} className="pl-4">
                        <p><strong>Input:</strong> {testCase.input}</p>
                        <p><strong>Output:</strong> {testCase.output}</p>
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
                <div className="mt-4">
                <h3 className="font-semibold">Test Cases</h3>
                {currentProblem.testCases.map((testCase, index) => (
                    <div key={index} className="p-2 border rounded-lg mt-2">
                    <div className="space-y-1">
                        <Label htmlFor={`test-case-input-${index}`}>Input</Label>
                        <Textarea
                        id={`test-case-input-${index}`}
                        placeholder="Input"
                        value={testCase.input}
                        onChange={(e) =>
                            handleTestCaseChange(index, "input", e.target.value)
                        }
                        />
                    </div>
                    <div className="space-y-1">
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
            <Button onClick={saveProblem} className="mt-4 w-full">
                {editIndex !== null ? "Save Changes" : "Add Problem"}
            </Button>
            </CardContent>

          </Card>
        </TabsContent>
      </Tabs>
      <Button className="m-4">
        Post
      </Button>
    </div>
  );
}
