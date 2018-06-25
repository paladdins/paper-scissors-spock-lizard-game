import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router";
import { addSocket } from "./actions/create-socket";

// socket-io client
import OpenSocket from "socket.io-client";

// import screens
import WelcomeScreen from "./screens/WelcomeScreen/WelcomeScreen";
import GameScreen from "./screens/GameScreen/GameScreen";

// import styles
import "./App.css";

class App extends Component {
  componentWillMount() {
    const socket = OpenSocket(
      "http://" + window.location.host.split(":")[0] + ":7777"
    );

    this.props.addSocket(socket);

    socket.on("the second has joined", msg => {});
  }

  componentDidMount() {}

  render() {
    return (
      <Switch>
        <Route exact path="/" component={WelcomeScreen} />
        <Route exact path="/room/:id" component={GameScreen} />
        <Redirect from="*" to="/" />
      </Switch>
    );
  }
}

function mapStateToProps(state, otherProps = {}) {
  return {
    socket: state.webSocket,
    ...otherProps
  };
}

export default compose(
  withRouter,
  connect(
    mapStateToProps,
    { addSocket }
  )
)(App);
