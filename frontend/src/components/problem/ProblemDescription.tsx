import React from "react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const problem = {
  title: "1. Two Sum",
  difficulty: "Easy",
  description: `Given an array of integers nums and an integer target, return indices of
the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same
element twice.

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
    "2 <= nums.length <= 104",
    "-10^9 <= nums[i] <= 10^9",
    "-10^9 <= target <= 10^9",
    "Only one valid answer exists.",
  ],
};

const ProblemDescription: React.FC = () => {
  return (
    <ScrollArea className="h-full w-full rounded-md border">
      <div className="bg-muted/50 p-5 w-full h-full">
        <div className="flex items-center gap-2 text-xl mb-4">
          <p className="font-semibold">{problem.title}</p>
          <Badge
            variant="secondary"
            className="text-[#14b8a6] font-light bg-[#31363F]"
          >
            {problem.difficulty}
          </Badge>
        </div>
        <pre className="whitespace-pre-wrap mt-2 text-sm">
          {problem.description}
        </pre>
        <div className="mt-4 text-sm">
          {problem.examples.map((example, index) => (
            <div key={index} className="mb-4">
              <p className="font-bold text-lg mb-2">Example {index + 1}:</p>
              <div className="mb-2 ml-5">
                <p className="font-semibold text-gray-300">Input:</p>
                <pre className="text-[#646464] text-opacity-80">
                  {example.input}
                </pre>
              </div>
              <div className="ml-5">
                <p className="font-semibold text-gray-300">Output:</p>
                <pre className="text-[#646464] text-opacity-80">
                  {example.output}
                </pre>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm flex flex-col">
          <p className="font-bold text-lg">Constraints:</p>
          {problem.constraints.map((constraint, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-[#646464] bg-[#31363F] font-light w-fit my-1 ml-2"
            >
              {constraint}
            </Badge>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default ProblemDescription;
