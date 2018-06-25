import React, { Component } from "react";
import { FormControl, Button } from "react-bootstrap";
import { connect } from "react-redux";
import * as ChatActionCreators from "../../actions/chat-actions";

import "./Chat.css";

class Chat extends Component {
  constructor(props) {
    super(props);

    this.chatContainerRef = React.createRef();
    this.chatMessageList = React.createRef();

    const socket = this.props.socket;

    socket.on("text message", msg => this.receiveMsg(msg));

    this.state = {
      chatClosed: true,
      chatMessages: [],
      textInput: "",
      unreadCounter: 0
    };

    this.closedChatTextSound = new Audio(
      "/sound-effects/closed-chat-text-sound.mp3"
    );
    this.chatTextSound = new Audio("/sound-effects/chat-text-sound.mp3");
  }

  // Scroll to last message
  scrollDownChatBody() {
    const scrollHeight = this.chatContainerRef.current.scrollHeight;
    const height = this.chatContainerRef.current.clientHeight;
    const scrollMax = scrollHeight - height + 150;
    this.chatContainerRef.current.scrollTop = scrollMax > 0 ? scrollMax : 0;
  }

  playSoundOnText() {
    this.props.chat.closed
      ? this.closedChatTextSound.play()
      : this.chatTextSound.play();
  }

  // Messages sent from current user
  sendTextMessage(e) {
    e.preventDefault();
    if (!this.props.chat.textInput.trim()) {
      return;
    }
    this.playSoundOnText();

    const socket = this.props.socket;

    console.log(this.props.chat.textInput);

    socket.emit("chat text", this.props.chat.textInput);

    this.props.sendMessage();
  }

  receiveMsg(msg) {
    console.log(msg);
    this.playSoundOnText();

    this.props.receiveMessage(msg);
  }

  render() {
    return (
      <div
        className={
          this.props.chat.closed ? "chat-container closed" : "chat-container"
        }
      >
        <div onClick={() => this.props.toggleChat()} className="header">
          <div className="name">Chat</div>

          {this.props.chat.unreadCounter > 0 ? (
            <div className="unread">{this.props.chat.unreadCounter}</div>
          ) : null}
        </div>
        <div ref={this.chatContainerRef} className="chat-body">
          <div ref={this.chatMessageList} className="message-list">
            {this.props.chat.messages.map((el, index) => {
              return (
                <div
                  key={index}
                  className={el.own ? "message" : "enemy message"}
                >
                  <div className="message-inner">{el.text}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="text-input">
          <form onSubmit={e => this.sendTextMessage(e)}>
            <FormControl
              type="text"
              placeholder="Enter your message here"
              onChange={e => this.props.typeMessage(e)}
              value={this.props.chat.textInput}
            />
            <Button bsStyle="primary" bsSize="small" type="submit">
              Submit
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    socket: state.webSocket,
    chat: state.chat
  };
}

export default connect(
  mapStateToProps,
  ChatActionCreators
)(Chat);
