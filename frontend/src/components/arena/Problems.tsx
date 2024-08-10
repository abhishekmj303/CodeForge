import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

import AddProblem from "./AddProblem";

interface Problems {
  type: string;
}

const Problems: React.FC<Problems> = ({ type }) => {
  const problems = [
    {
      id: "two-sum",
      title: "1. Two Sum",
      difficulty: "Easy",
      status: "Not solved",
    },
  ];

  return (
    <Card className="w-[40rem] m-5">
      <CardHeader className="px-7 flex flex-row justify-between items-start">
        <div>
          <CardTitle>Problem Statements</CardTitle>
          <CardDescription>
            A list of currently available problems.
          </CardDescription>
        </div>
        {type === "arena" && <AddProblem />}
      </CardHeader>
      <CardContent>
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Title</TableHead>
              <TableHead className="text-center">Difficulty</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {problems.map((problem) => (
              <TableRow key={problem.id} className="">
                <TableCell className="text-left cursor-pointer">
                  <Link to={`/arena/${problem.id}`}>{problem.title}</Link>
                </TableCell>
                <TableCell className="text-center">
                  {problem.difficulty.toLowerCase() === "easy" ? (
                    <Badge
                      variant="secondary"
                      className="text-xs font-light text-[#14b8a6]"
                    >
                      {problem.difficulty}
                    </Badge>
                  ) : problem.difficulty.toLowerCase() === "medium" ? (
                    <Badge
                      variant="secondary"
                      className="text-xs font-light text-[#f59e0b]"
                    >
                      {problem.difficulty}
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="text-xs font-light text-[#ef4444]"
                    >
                      {problem.difficulty}
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">{problem.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Problems;
