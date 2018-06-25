import { combineReducers } from "redux";

// Reducers
import WeaponsReducer from "./weapons";
import WebSocketInstance from "./websocketInstance";
import ChatReducers from "./chat";

const allReducers = combineReducers({
  weapons: WeaponsReducer,
  webSocket: WebSocketInstance,
  chat: ChatReducers
});

export { allReducers };
