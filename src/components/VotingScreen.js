import { Input, Button } from "antd";
import React, { useState, useEffect } from "react";
import database from "../database.js";

const VotingScreen = (props) => {
  const { userAnswers, questionText } = props;

  return (
    <div>
      <div>
        The given answers to the question: <strong>{questionText}</strong>:
        {userAnswers.map((answer) => (
          <div key={answer}>{answer}</div>
        ))}
      </div>
    </div>
  );
};

export default VotingScreen;
