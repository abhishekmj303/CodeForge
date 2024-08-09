import React from "react";
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

const Leaderboard: React.FC = () => {
  const leaderboard = [
    {
      rank: 1,
      username: "john_doe",
      solved: 5,
      timeTaken: "1h 30m",
    },
    {
      rank: 2,
      username: "jane_smith",
      solved: 4,
      timeTaken: "2h 10m",
    },
    {
      rank: 3,
      username: "alice_wonder",
      solved: 4,
      timeTaken: "2h 45m",
    },
  ];

  return (
    <Card className="w-[40rem]">
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
        <CardDescription>
          The top performers in the contest.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Rank</TableHead>
              <TableHead className="text-center">Username</TableHead>
              <TableHead className="text-center">Solved</TableHead>
              <TableHead className="text-right">Time Taken</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((entry) => (
              <TableRow key={entry.rank}>
                <TableCell className="text-left">{entry.rank}</TableCell>
                <TableCell className="text-center">{entry.username}</TableCell>
                <TableCell className="text-center">{entry.solved}</TableCell>
                <TableCell className="text-right">{entry.timeTaken}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
