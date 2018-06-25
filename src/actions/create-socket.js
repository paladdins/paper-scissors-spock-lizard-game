function addSocket(socket) {
  return {
    type: "ADD_WEBSOCKET",
    payload: socket
  };
}

export { addSocket };
