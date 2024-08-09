import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Playground from "./pages/Playground";
import Arena from "./pages/Arena";
import ProblemDetail from "./pages/ProblemDetail";
import Battleground from "./pages/Battleground";
import Navbar from "@/components/Navbar";
import AddContestPage from "./pages/AddContestPage";
import Contest from "./pages/Contest";
import { Separator } from "@/components/ui/separator";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Separator orientation="horizontal" />
        <main className="bg-muted/40">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/arena" element={<Arena />} />
            <Route path="/arena/:problem_id" element={<ProblemDetail />} />{" "}
            {/* Dynamic Route */}
            <Route path="/battleground" element={<Battleground />} />
            <Route path="/battleground/:contest_id" element={<Contest />} />{" "}
            {/* Dynamic Route */}
            <Route path="/add-contest" element={<AddContestPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
