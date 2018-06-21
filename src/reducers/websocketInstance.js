// socket-io client
import OpenSocket from "socket.io-client";

export default function() {
  const socket = OpenSocket(
    "http://" + window.location.host.split(":")[0] + ":7777"
  );
  return socket;
}
