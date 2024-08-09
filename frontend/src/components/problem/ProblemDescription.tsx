import React from "react";
import { Badge } from "@/components/ui/badge";

const ProblemDescription: React.FC = () => {
  return (
    <div className="bg-muted/50 p-5 w-full h-full">
      <div className="flex flex-row gap-2 text-xl items-center">
        <p className="font-semibold">1. Two Sum</p>
        <Badge
          variant="secondary"
          className="text-[#14b8a6] font-light bg-[#31363F]"
        >
          Easy
        </Badge>
      </div>
      <pre className="whitespace-pre-wrap text-xs">
        {`
Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.


Example 1:
    Input:
      9
      2, 7, 11, 15
    Output: 0, 1

Example 2:
    Input: 
      6
      3, 2, 4
    Output: 1, 2

Example 3:
    Input: 
      6
      3, 3
    Output: 0, 1

Constraints:
    2 <= nums.length <= 104
    -109 <= nums[i] <= 109
    -109 <= target <= 109
    Only one valid answer exists.
        `}
      </pre>
    </div>
  );
};

export default ProblemDescription;
