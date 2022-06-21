import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import View from "./components/View";
import Registrations from "./components/Registrations";
import { PermissionProvider } from "./state/permissions";
import { ResultProvider } from "./state/results";
import GameList from "./components/GameList";
import TeamManager from "./components/TeamManager";
import Admin from "components/Admin";

const App = () => {
  return (
    <PermissionProvider>
      <ResultProvider>
        <Router>
          <Routes>
            <Route path="/" element={<View />}>
              <Route path="/admin" element={<Admin />} />
            </Route>
            <Route path="/registrations" element={<Registrations />} />
            <Route path="/gameManager" element={<GameList />} />
            <Route path="/teamManager" element={<TeamManager />} />
          </Routes>
        </Router>
      </ResultProvider>
    </PermissionProvider>
  );
};

export default App;
