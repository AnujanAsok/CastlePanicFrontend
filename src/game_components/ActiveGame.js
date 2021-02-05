import { Input, Button } from "antd";
import "antd/dist/antd.css";
import React, { useState, useEffect } from "react";
import database from "../database.js";
import VotingPage from "./VotingPage.js";

const ActiveGame = (props) => {
  const {
    id,
    gameHost,
    listOfUsers,
    hasGameStarted,
    username,
    isGameHost,
  } = props;

  const gameIDRef = database.ref(`games/${id}`);
  const focusedUserRef = database.ref(`games/${id}/focusedUser`);
  const [questionID, setQuestionID] = useState(0);
  const [questionText, setQuestionText] = useState("");
  const [answer, setAnswer] = useState("");
  const [displayAnswer, setDisplayAnswer] = useState([[]]);
  const [hasSubmittedAnswer, setHasSubmittedAnswer] = useState(false);
  const [focusedUser, setFocusedUser] = useState("");
  const questions = [
    `What is ${focusedUser}'s favourite color?`,
    `What is ${focusedUser}'s favourite food?`,
    `What is ${focusedUser}'s favourite car?`,
    `What is ${focusedUser}'s favourite animal?`,
  ];

  const handleClick = (e) => {
    const newQuestionID = questionID + 1;
    console.log(newQuestionID);

    setHasSubmittedAnswer(false);

    const chosenQuestion =
      questions[Math.floor(Math.random() * questions.length)];
    const selectFocusedUser =
      listOfUsers[Math.floor(Math.random() * listOfUsers.length)];
    focusedUserRef.set(selectFocusedUser);

    gameIDRef
      .child(`questionIDs`)
      .update({ current_question_ID: newQuestionID });
    gameIDRef
      .child(`/questions/${newQuestionID}`)
      .update({ questiontxt: chosenQuestion });
  };

  const handleAnswerClick = () => {
    gameIDRef
      .child(`/questions/${questionID}/answers`)
      .update({ [username]: answer });
    setHasSubmittedAnswer(true);
  };

  useEffect(() => {
    gameIDRef
      .child(`questions/${questionID}/answers`)
      .on("value", (snapshot) => {
        const checkAnswers = snapshot.val();
        if (checkAnswers) {
          setDisplayAnswer(Object.values(checkAnswers));
          console.log(Object.values("What is saved to firebase", checkAnswers));
        }
      });
  }, []);

  useEffect(() => {
    focusedUserRef.on("value", (snapshot) => {
      const checkFocusedUser = snapshot.val();
      console.log("checking snapshot.val", checkFocusedUser);
      if (checkFocusedUser) {
        setFocusedUser(checkFocusedUser);
      }
    });
  }, []);

  useEffect(() => {
    gameIDRef.child(`questionIDs`).on("value", (snapshot) => {
      const checkQuestionID = snapshot.val();
      if (checkQuestionID) {
        setQuestionID(checkQuestionID.current_question_ID);
      }
    });
  }, []);

  useEffect(() => {
    gameIDRef.child(`/questions/${questionID}`).on("value", (snapshot) => {
      const checkChosenQuestion = snapshot.val();
      console.log("checking snapshot.val", checkChosenQuestion);
      if (checkChosenQuestion) {
        setQuestionText(checkChosenQuestion.questiontxt);
      }
    });
  }, [questionID]);

  return (
    <div>
      {" "}
      {!hasSubmittedAnswer && questionText}
      <div>
        {!hasSubmittedAnswer && (
          <Input
            id="answer"
            placeholder="Please enter your answer here"
            onChange={(e) => setAnswer(e.target.value)}
          />
        )}
        <div>
          {!hasSubmittedAnswer && (
            <Button type="primary" onClick={handleAnswerClick}>
              Submit
            </Button>
          )}
          <div>
            {isGameHost && (
              <Button type="primary" onClick={handleClick}>
                Generate question
              </Button>
            )}
          </div>
        </div>
        <div>
          {displayAnswer.length === listOfUsers.length ? (
            <VotingPage
              displayAnswer={displayAnswer}
              id={id}
              gameHost={gameHost}
              hasGameStarted={hasGameStarted}
              listOfUsers={listOfUsers}
              username={username}
              isGameHost={isGameHost}
              questionText={questionText}
            />
          ) : (
            hasSubmittedAnswer && (
              <div>Please wait for everybody to submit their answers</div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveGame;
