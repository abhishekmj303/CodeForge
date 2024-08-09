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

const Problems: React.FC = () => {
  const problems = [
    {
      id: "two-sum",
      title: "Two Sum",
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
        <AddProblem />
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
              <TableRow key={problem.id} className="cursor-pointer">
                <TableCell className="text-left">
                  <Link to={`/arena/${problem.id}`}>{problem.title}</Link>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">{problem.difficulty}</Badge>
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
