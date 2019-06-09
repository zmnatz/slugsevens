import React, { memo } from "react";
import { Router } from "@reach/router";
import "semantic-ui-css/semantic.min.css";
import View from "./components/View";
import Registrations from "./components/Registrations";
import { PermissionProvider } from "./state/permissions";
import {ResultProvider} from "state/results";

const App = memo(() => {
  return <PermissionProvider>
    <ResultProvider>
      <Router>
        <Registrations path="/registrations" />
        <View default/>
      </Router>
    </ResultProvider>
  </PermissionProvider>
})

export default App;
