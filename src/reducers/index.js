import { combineReducers } from "redux";

// Reducers
import WeaponsReducer from "./weapons";
import WebSocketInstance from "./websocketInstance";

const allReducers = combineReducers({
  weapons: WeaponsReducer,
  webSocket: WebSocketInstance
});

export { allReducers };
