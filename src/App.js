import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Welcome from "./pages/Welcome";
import Main from "./pages/Main";

function App() {
  const isAuthenticated = true;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />

        {isAuthenticated ? (
          <Route path="/main" element={<Main />} />
        ) : (
          <Navigate to="/" replace />
        )}
      </Routes>
    </Router>
  );
}

export default App;
