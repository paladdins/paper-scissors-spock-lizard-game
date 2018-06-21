import React, { Component } from "react";
import "./GameHeader.css";

class GameHeader extends Component {
  // SocketObj Container
  socket;

  constructor(props) {
    super(props);

    this.socket = this.props.socket;
  }
  render() {}
}

export default GameHeader;
