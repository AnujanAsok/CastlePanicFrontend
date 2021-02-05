import { Input, Button } from "antd";
import "antd/dist/antd.css";
import database from "../database.js";

const Lobby = (props) => {
  const {
    id,
    gameHost,
    listOfUsers,
    hasGameStarted,
    username,
    isGameHost,
    setUsername,
  } = props;
  const gameUsernamesRef = database.ref(`games/${id}/usernames`);

  const handleClick = () => {
    const focusedUserRef = database.ref(`games/${id}/focusedUser`);
    const selectFocusedUser =
      listOfUsers[Math.floor(Math.random() * listOfUsers.length)];
    focusedUserRef.set(selectFocusedUser);
  };

  return (
    <div>
      <div>
        {" "}
        Game code is: {id}
        <div>
          <div>
            The current game host is <strong>{gameHost}</strong>
          </div>
          <div>Game has started : {hasGameStarted.toString()}</div>
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
          {" "}
          {isGameHost && (
            <Button type="primary" onClick={handleClick}>
              Start Game
            </Button>
          )}{" "}
        </div>
        <div>
          <div>{!listOfUsers.length && <div>No Users Present</div>}</div>
          {listOfUsers.map((user) => (
            <div key={user}> {user} </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lobby;
