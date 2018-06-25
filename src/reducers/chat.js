const initialState = {
  textInput: "",
  messages: [],
  unreadCounter: 0,
  closed: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case "TOGGLE_CHAT":
      console.log(state.closed);
      return Object.assign({}, state, {
        closed: !state.closed,
        unreadCounter: state.closed ? 0 : state.unreadCounter
      });
    case "SEND_MESSAGE":
      return Object.assign({}, state, {
        textInput: "",
        messages: [
          ...state.messages,
          {
            own: true,
            text: state.textInput
          }
        ]
      });
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
