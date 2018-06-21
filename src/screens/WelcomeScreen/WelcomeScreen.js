import React, { Component } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router";
import "./WelcomeScreen.css";

import { Button, FormControl } from "react-bootstrap";

class WelcomeScreen extends Component {
  welcomeContainerStyle = {
    height: window.innerHeight
  };

  constructor(props) {
    super(props);

    this.state = {
      link: "",
      copied: false,
      roomId: null
    };

    const socket = this.props.socket;
    socket.on("room created", msg => this.createRoomLink(msg));
    socket.on("the second has joined", () =>
      this.props.history.push("/room/" + this.state.roomId)
    );

    socket.emit("create room");
  }

  componentWillMount() {}

  // Create room and get the invitation link
  createRoomLink(msg) {
    const link = window.location.href + "room/" + msg;
    const roomId = msg;
    this.setState({ link, roomId });
  }

  render() {
    return (
      <div style={this.welcomeContainerStyle} className="welcome-container">
        <h1>Welcome to Paper-Scissors-Spock-Lizard game!</h1>
        <div className="description">
          <p>
            It's two-player-game so you need to invite one of your friends (or
            you can open the link in another tab if you are forever alone :D)
          </p>
        </div>
        <div className="form-block">
          <FormControl
            id="link-field"
            type="text"
            value={this.state.link}
            disabled
          />

          <CopyToClipboard
            text={this.state.link}
            onCopy={() => this.setState({ copied: true })}
          >
            <Button bsStyle="primary">Copy link</Button>
          </CopyToClipboard>

          {this.state.copied ? <span>Copied!</span> : null}
        </div>
      </div>
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
  connect(mapStateToProps)
)(WelcomeScreen);
