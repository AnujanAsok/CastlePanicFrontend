import React, { useState, useEffect } from "react";
import "./App.css";
import { Input, Button } from "antd";
import "antd/dist/antd.css";
import firebase from "firebase/app";
import "firebase/database";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9TJMd9dTh-lyy9-crhM6_mTgt73N42kI",
  authDomain: "castlepanic-9082b.firebaseapp.com",
  databaseURL: "https://castlepanic-9082b-default-rtdb.firebaseio.com",
  projectId: "castlepanic-9082b",
  storageBucket: "castlepanic-9082b.appspot.com",
  messagingSenderId: "29298888899",
  appId: "1:29298888899:web:86786636450aaf2998d276",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

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

const GamePage = () => {
  const { id } = useParams();
  const [username, setUsername] = useState(
    localStorage.getItem("userName") || ""
  );
  const gameUsernamesRef = database.ref(`games/${id}/usernames`);

  const [listOfUsers, setListOfUsers] = useState([]);

  useEffect(() => {
    gameUsernamesRef.on("value", (snapshot) =>
      setListOfUsers(Object.keys(snapshot.val()))
    );
  }, []);

  console.log(listOfUsers);
  return (
    <div>
      {" "}
      Game code is: {id}
      <div>
        Username:{" "}
        <Input
          id="userName"
          value={username}
          placeholder="Please enter your username here"
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button
          type="primary"
          onClick={() => {
            localStorage.setItem("userName", username);
            console.log(username);
            gameUsernamesRef.update({ [username]: true });
          }}
        >
          Save
        </Button>
      </div>
      <div>
        <div>{!listOfUsers.length && "No Users Present"}</div>
        {listOfUsers.map((user) => (
          <div key={user}> {user} </div>
        ))}
      </div>
    </div>
  );
};

export default App;
