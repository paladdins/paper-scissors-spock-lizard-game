// const app = require("express")();
const server = require("http").createServer();
const io = require("socket.io")(server, {
  path: "/",
  serveClient: false,
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false
});

const port = 7777;
const rooms = [];

// Main game rules
const weaponRules = {
  rock: ["scissors", "lizard"],
  paper: ["rock", "spock"],
  spock: ["rock", "scissors"],
  lizard: ["spock", "paper"],
  scissors: ["lizard", "paper"]
};

server.listen(port, () => {
  console.log("* listening to a port :" + port);
});

io.on("connection", socket => {
  socket.on("create room", () => createRoom(socket));
  socket.on("join room", room_id => joinToRoom(socket, room_id));
  socket.on("chosen weapon", weapon => chosenWeapon(socket, weapon));
  socket.on("disconnect", () => leaveRoom(socket));
  socket.on("chat text", msg => chatText(socket, msg));
});

// User came to main page
function createRoom(socket) {
  const room_id = rooms.length;
  rooms.push({
    users: {}
  });
  rooms[room_id].users[socket.id] = "";
  socket.room_id = room_id;
  socket.join(room_id);
  socket.emit("room created", room_id);
}

// User came by the invitation link
function joinToRoom(socket, room_id) {
  if (!rooms[room_id]) {
    socket.emit("no such room");
    return;
  }

  const users = rooms[room_id].users;

  if (users) {
    usersKeys = Object.keys(users);
    if (!(socket.id in users) && usersKeys.length == 2) {
      // Return if room has already 2 participants
      socket.emit("room is full");
      return;
    }

    users[socket.id] = "";
    socket.room_id = room_id;
    socket.join(room_id);
    socket.broadcast.to(room_id).emit("the second has joined");
  }
}

// Disconnected, by any reason
function leaveRoom(socket) {
  const room = rooms[socket.room_id];
  const users = room && room.users;
  socket.leave(socket.room_id);

  if (users && typeof users[socket.id] === "string") {
    delete users[socket.id];
  }

  // Delete room if there is no players anymore
  if (users && Object.keys(users).length === 0) {
    rooms.splice(socket.room_id, 1);
  }
}

// Players weapons processing
function chosenWeapon(socket, weapon) {
  const users = rooms[socket.room_id].users;
  users[socket.id] = weapon;

  // Check if both players did their choice
  const everyBodyIsReady = Object.values(users).every(
    el => el.trim().length > 0
  );

  if (!everyBodyIsReady) {
    io.to(socket.id).emit("w8ing for another");
    return;
  }

  const sockets = Object.keys(users);
  const firstWon = weaponRules[users[sockets[0]]].indexOf(users[sockets[1]]);

  if (firstWon > -1) {
    // The first player won
    io.to(sockets[0]).emit("round result", {
      won: true,
      enemyWeapon: users[sockets[1]]
    });
    io.to(sockets[1]).emit("round result", {
      won: false,
      enemyWeapon: users[sockets[0]]
    });
  } else if (users[sockets[0]] === users[sockets[1]]) {
    // If players have chosen the same weapon
    io.sockets.in(socket.room_id).emit("round result", {
      won: false,
      draw: true,
      enemyWeapon: users[sockets[1]]
    });
  } else {
    // The second player won
    io.to(sockets[0]).emit("round result", {
      won: false,
      enemyWeapon: users[sockets[1]]
    });
    io.to(sockets[1]).emit("round result", {
      won: true,
      enemyWeapon: users[sockets[0]]
    });
  }

  // Clear weapons
  sockets.forEach(el => (users[el] = ""));
}

// Send text to the enemy
function chatText(socket, msg) {
  socket.broadcast.to(socket.room_id).emit("text message", msg);
}
