function sendMessage() {
  return {
    type: "SEND_MESSAGE",
    payload: null
  };
}
function typeMessage(e) {
  return {
    type: "TYPE_MESSAGE",
    payload: e.target.value
  };
}
function receiveMessage(msg) {
  return {
    type: "RECEIVE_MESSAGE",
    payload: msg
  };
}
function toggleChat() {
  return {
    type: "TOGGLE_CHAT",
    payload: null
  };
}

export { sendMessage, typeMessage, receiveMessage, toggleChat };
