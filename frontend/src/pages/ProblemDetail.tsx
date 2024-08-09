import React from "react";
// import { useParams } from "react-router-dom";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import CodeEditor from "@/components/editor/CodeEditor";
import ProblemDescription from "@/components/problem/ProblemDescription";
import InputOutput from "@/components/problem/InputOutput";

const ProblemDetail: React.FC = () => {
  //   const { problem_id } = useParams<{ problem_id: string }>();

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>
        <ProblemDescription />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel>
            <CodeEditor />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            <InputOutput />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ProblemDetail;
