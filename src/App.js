import React from "react";
import "./App.css";
import database from "./database.js";
import GamePage from "./game_components/GamePage.js";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact={true} path="/" children={<MainPage />} />
        <Route path="/:id" children={<GamePage />} />
      </Switch>
    </Router>
  );
}

const MainPage = () => {
  const gameCode = (Math.random() * 9000 + 1000).toFixed(0);
  return (
    <div className="App">
      This is main page. <Link to={`/${gameCode}`}>{gameCode}</Link>
    </div>
  );
};

export default App;
