import "./App.css";
import Main from "./Components/Main";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Second from "./Components/Second";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/second" element={<Second />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
