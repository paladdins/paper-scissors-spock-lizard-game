export default function(state = null, action) {
  switch (action.type) {
    case "ADD_WEBSOCKET":
      return action.payload;
    default:
      return state;
  }
}
