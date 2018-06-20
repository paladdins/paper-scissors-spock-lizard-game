import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// socket-io client
import OpenSocket from "socket.io-client";

// import screens
import WelcomeScreen from "./screens/WelcomeScreen/WelcomeScreen";
import GameScreen from "./screens/GameScreen/GameScreen";

// import styles
import "./App.css";

const socket = OpenSocket(
  "http://" + window.location.host.split(":")[0] + ":7777"
);

class App extends Component {
  constructor() {
    super();

    socket.on("the second has joined", msg => {});
  }

  componentDidMount() {}

  render() {
    return (
      <Switch>
        <Route
          exact
          path="/"
          render={props => <WelcomeScreen {...props} socket={socket} />}
        />
        <Route
          exact
          path="/room/:id"
          render={props => <GameScreen {...props} socket={socket} />}
        />
        <Redirect from="*" to="/" />
      </Switch>
    );
  }
}

export default App;
