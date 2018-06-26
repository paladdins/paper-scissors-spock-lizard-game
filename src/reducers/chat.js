const initialState = {
  textInput: "",
  messages: [],
  unreadCounter: 0,
  closed: true
};

const toggleChat = ({ closed, unreadCounter, ...state }) => ({
  ...state,
  closed: !closed,
  unreadCounter: closed ? 0 : unreadCounter
});

const sendMessage = ({ messages, textInput, ...state }) => ({
  ...state,
  textInput: "",
  messages: messages.concat({
    own: true,
    text: textInput
  })
});

export default function(state = initialState, action) {
  switch (action.type) {
    case "TOGGLE_CHAT":
      return toggleChat(state);
    case "SEND_MESSAGE":
      return sendMessage(state);
    case "RECEIVE_MESSAGE":
      return Object.assign({}, state, {
        unreadCounter: state.closed ? state.unreadCounter + 1 : 0,
        messages: [
          ...state.messages,
          {
            own: false,
            text: action.payload
          }
        ]
      });
    case "TYPE_MESSAGE":
      return Object.assign({}, state, { textInput: action.payload });
    default:
      return state;
  }
}
