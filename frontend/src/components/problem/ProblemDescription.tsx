import React from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const problem = {
  title: "1. Two Sum",
  difficulty: "Easy",
  description: `Given an array of integers nums and an integer target, return indices of
the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
  examples: [
    {
      input: "9\n2, 7, 11, 15",
      output: "0, 1",
    },
    {
      input: "6\n3, 2, 4",
      output: "1, 2",
    },
    {
      input: "6\n3, 3",
      output: "0, 1",
    },
  ],
  constraints: [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9",
    "-10^9 <= target <= 10^9",
    "Only one valid answer exists.",
  ],
};

const ProblemDescription: React.FC = () => {
  return (
    <ScrollArea className="h-full w-full">
      <div className="bg-muted/50 p-5 w-full h-full">
        <div className="flex items-center gap-2 text-xl mb-4">
          <p className="font-semibold">{problem.title}</p>
          {problem.difficulty === "Easy" ? (
            <Badge
              variant="secondary"
              className="text-xs font-light text-[#14b8a6]"
            >
              {problem.difficulty}
            </Badge>
          ) : problem.difficulty === "Medium" ? (
            <Badge
              variant="secondary"
              className="text-xs font-light text-[#f1c40f]"
            >
              {problem.difficulty}
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="text-xs font-light text-[#e74c3c]"
            >
              {problem.difficulty}
            </Badge>
          )}
        </div>
        <pre className="whitespace-pre-wrap mt-2 text-sm">
          {problem.description}
        </pre>
        <div className="mt-4 text-sm">
          {problem.examples.map((example, index) => (
            <div key={index} className="mb-4">
              <p className="font-bold text-md mb-1">Example {index + 1}:</p>
              <div className="mb-2 ml-5 text-sm">
                <p className="font-semibold">Input:</p>
                <pre className="text-[#ffffff99]">{example.input}</pre>
              </div>
              <div className="ml-5 text-sm">
                <p className="font-semibold">Output:</p>
                <pre className="text-[#ffffff99]">{example.output}</pre>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm flex flex-col">
          <p className="font-bold text-md">Constraints:</p>
          {problem.constraints.map((constraint, index) => (
            <p
              key={index}
              className="text-[#ffffff99] text-sm font-light w-fit my-1 ml-5"
            >
              {constraint}
            </p>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default ProblemDescription;
