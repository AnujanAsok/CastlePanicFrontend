import { Input, Button } from "antd";
import React, { useState, useEffect } from "react";
import database from "../database";
import VotingScreen from "./VotingScreen";

const ActiveGame = (props) => {
  const {
    gameID,
    gameHost,
    listOfUsers,
    hasGameStarted,
    username,
    isGameHost,
  } = props;

  const gameRef = database.ref(`games/${gameID}`);
  const focusedUserRef = database.ref(`games/${gameID}/focusedUser`);
  const [questionID, setQuestionID] = useState(0);
  const [questionText, setQuestionText] = useState("");
  const [answer, setAnswer] = useState("");
  const [userAnswers, setUserAnswers] = useState([]);
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

    setHasSubmittedAnswer(false);

    const chosenQuestion =
      questions[Math.floor(Math.random() * questions.length)];
    const selectFocusedUser =
      listOfUsers[Math.floor(Math.random() * listOfUsers.length)];
    focusedUserRef.set(selectFocusedUser);

    gameRef.child(`questionIDs`).update({ current_question_ID: newQuestionID });
    gameRef
      .child(`/questions/${newQuestionID}`)
      .update({ questiontxt: chosenQuestion });
  };

  const handleAnswerClick = () => {
    gameRef
      .child(`/questions/${questionID}/answers`)
      .update({ [username]: answer });
    setHasSubmittedAnswer(true);
  };

  useEffect(() => {
    gameRef
      .child(`/questions/${questionID}/answers`)
      .on("value", (snapshot) => {
        const checkAnswers = snapshot.val();
        console.log("check answers snapshot", checkAnswers);
        if (checkAnswers) {
          setUserAnswers(Object.values(checkAnswers));
        }
      });
  }, [questionID]);

  useEffect(() => {
    focusedUserRef.on("value", (snapshot) => {
      const checkFocusedUser = snapshot.val();
      if (checkFocusedUser) {
        setFocusedUser(checkFocusedUser);
      }
    });
  }, []);

  useEffect(() => {
    gameRef.child(`questionIDs`).on("value", (snapshot) => {
      const checkQuestionID = snapshot.val();
      if (checkQuestionID) {
        setQuestionID(checkQuestionID.current_question_ID);
      }
    });
  }, []);

  useEffect(() => {
    gameRef.child(`/questions/${questionID}`).on("value", (snapshot) => {
      const checkChosenQuestion = snapshot.val();
      console.log("checking chosen question", checkChosenQuestion);
      if (checkChosenQuestion) {
        setQuestionText(checkChosenQuestion.questiontxt);
      }
    });
  }, [questionID]);

  console.log("the length of user answers", userAnswers.length);

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
          {userAnswers.length === listOfUsers.length ? (
            <VotingScreen
              userAnswers={userAnswers}
              id={gameID}
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
