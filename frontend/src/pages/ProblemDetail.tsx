import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = sessionStorage.getItem("username");
    if (!storedUserName) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ResizablePanelGroup direction="horizontal" className="gap-[1.5px]">
      <ResizablePanel
        defaultSize={50}
        className="rounded-[7px] border-[2px] border-[#555555]"
      >
        <ProblemDescription />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical" className="gap-[1.5px]">
          <ResizablePanel
            defaultSize={50}
            className="rounded-[7px] border-[2px] border-[#555555]"
          >
            <CodeEditor />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={50}
            className="rounded-[7px] border-[2px] border-[#555555]"
          >
            <InputOutput />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default ProblemDetail;
