import React, { useState, useEffect } from "react";
import database from "../database.js";
import { useParams } from "react-router-dom";
import ActiveGame from "./ActiveGame.js";
import Lobby from "./Lobby.js";

const GamePage = () => {
  const { id } = useParams();
  const [username, setUsername] = useState(
    localStorage.getItem("userName") || ""
  );
  const gameUsernamesRef = database.ref(`games/${id}/usernames`);
  const focusedUserRef = database.ref(`games/${id}/focusedUser`);

  const [listOfUsers, setListOfUsers] = useState([]);
  const [focusedUser, setFocusedUser] = useState("");

  const gameHost = listOfUsers[0];
  const hasGameStarted = focusedUser ? true : false;

  useEffect(() => {
    gameUsernamesRef.on("value", (snapshot) => {
      const usernameList = snapshot.val();
      if (usernameList) {
        setListOfUsers(Object.keys(usernameList));
      }
    });
  }, []);

  const isGameHost = username === gameHost;
  console.log("list of users: ", listOfUsers);
  console.log("game host: ", gameHost);

  useEffect(() => {
    focusedUserRef.on("value", (snapshot) => {
      const checkFocusedUser = snapshot.val();
      console.log("checking snapshot.val", checkFocusedUser);
      if (checkFocusedUser) {
        setFocusedUser(checkFocusedUser);
      }
    });
  }, []);

  console.log("focused user", focusedUser);

  return (
    <div>
      {hasGameStarted === false && (
        <Lobby
          id={id}
          gameHost={gameHost}
          hasGameStarted={hasGameStarted}
          listOfUsers={listOfUsers}
          username={username}
          isGameHost={isGameHost}
          setUsername={setUsername}
        />
      )}
      {hasGameStarted === true && (
        <ActiveGame
          id={id}
          gameHost={gameHost}
          hasGameStarted={hasGameStarted}
          listOfUsers={listOfUsers}
          username={username}
          isGameHost={isGameHost}
        />
      )}
    </div>
  );
};

export default GamePage;
