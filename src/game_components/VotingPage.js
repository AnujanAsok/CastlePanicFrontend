import { Input, Button } from "antd";
import "antd/dist/antd.css";
import React, { useState, useEffect } from "react";
import database from "../database.js";

const VotingPage = (props) => {
  const {
    id,
    gameHost,
    listOfUsers,
    hasGameStarted,
    username,
    isGameHost,
    setUsername,
    displayAnswer,
    questionText,
  } = props;

  return (
    <div>
      <div>
        The given answers to the question: <strong>{questionText}</strong>:
        {displayAnswer.map((answer) => (
          <div key={answer}>{answer}</div>
        ))}
      </div>
    </div>
  );
};

export default VotingPage;
