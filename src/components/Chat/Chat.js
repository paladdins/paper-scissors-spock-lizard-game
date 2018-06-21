import React, { Component } from "react";
import { FormControl, Button } from "react-bootstrap";
import { connect } from "react-redux";

import "./Chat.css";

class Chat extends Component {
  constructor(props) {
    super(props);

    this.chatContainerRef = React.createRef();
    this.chatMessageList = React.createRef();

    const socket = this.props.socket;

    socket.on("text message", msg => this.newMsg(msg));

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

  // Render new list
  updateChatList(msgs) {
    this.chatMessagesJsx = msgs.map((el, index) => {
      return (
        <div key={index} className={el.own ? "message" : "enemy message"}>
          <div className="message-inner">{el.text}</div>
        </div>
      );
    });

    this.scrollDownChatBody();
  }

  // Scroll to last message
  scrollDownChatBody() {
    console.log(this.chatContainerRef);
    const scrollHeight = this.chatContainerRef.current.scrollHeight;
    const height = this.chatContainerRef.current.clientHeight;
    const scrollMax = scrollHeight - height + 150;
    this.chatContainerRef.current.scrollTop = scrollMax > 0 ? scrollMax : 0;
  }

  changeTextInput(e) {
    const input = e.target.value;
    this.setState({ textInput: input });
  }

  playSoundOnText() {
    this.state.chatClosed
      ? this.closedChatTextSound.play()
      : this.chatTextSound.play();
  }

  // Messages sent from current user
  sendTextMessage(e) {
    e.preventDefault();
    if (!this.state.textInput.trim()) {
      return;
    }
    this.playSoundOnText();

    const socket = this.props.socket;
    const newMessage = {
      own: true,
      text: this.state.textInput
    };

    socket.emit("chat text", this.state.textInput);

    this.setState(prevState => {
      const msgs = [...prevState.chatMessages, newMessage];
      this.updateChatList(msgs);

      return {
        chatMessages: msgs,
        textInput: ""
      };
    });
  }

  // Messages received from socket.io
  newMsg(msg) {
    this.playSoundOnText();
    const newMessage = {
      own: false,
      text: msg
    };

    this.setState(prevState => {
      const msgs = [...prevState.chatMessages, newMessage];
      this.updateChatList(msgs);

      // if chat is closed, increment unread counter
      const unreadCounter = prevState.chatClosed
        ? prevState.unreadCounter + 1
        : prevState.unreadCounter;

      return {
        chatMessages: [...prevState.chatMessages, newMessage],
        textInput: "",
        unreadCounter: unreadCounter
      };
    });
  }

  // Open-close chat
  toggleChat() {
    if (this.state.chatClosed) {
      this.setState({ unreadCounter: 0 });
    }
    this.setState(prev => {
      return {
        chatClosed: !prev.chatClosed
      };
    });
  }

  render() {
    return (
      <div
        className={
          this.state.chatClosed ? "chat-container closed" : "chat-container"
        }
      >
        <div onClick={() => this.toggleChat()} className="header">
          <div className="name">Chat</div>

          {this.state.unreadCounter > 0 ? (
            <div className="unread">{this.state.unreadCounter}</div>
          ) : null}
        </div>
        <div ref={this.chatContainerRef} className="chat-body">
          <div ref={this.chatMessageList} className="message-list">
            {this.chatMessagesJsx}
          </div>
        </div>
        <div className="text-input">
          <form onSubmit={e => this.sendTextMessage(e)}>
            <FormControl
              type="text"
              placeholder="Enter your message here"
              onChange={e => this.changeTextInput(e)}
              value={this.state.textInput}
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
    socket: state.webSocket
  };
}

export default connect(mapStateToProps)(Chat);
