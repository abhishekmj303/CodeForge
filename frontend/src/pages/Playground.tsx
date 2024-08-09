import React from "react";
import CodeEditor from "@/components/editor/CodeEditor";

const Playground: React.FC = () => {
  return (
    <div>
      <h2>Playground</h2>
      <p>Welcome to the Playground page!</p>
      <CodeEditor />
    </div>
  );
};

export default Playground;
