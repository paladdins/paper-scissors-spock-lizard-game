import React, { Component } from "react";
import Chat from "../../components/Chat/Chat";
import "./GameScreen.css";

class GameScreen extends Component {
  weapons = [
    {
      name: "rock",
      style: {
        background: "url(/images/rock.png)"
      }
    },
    {
      name: "paper",
      style: {
        background: "url(/images/paper.png)"
      }
    },
    {
      name: "spock",
      style: {
        background: "url(/images/spock.png)"
      }
    },
    {
      name: "lizard",
      style: {
        background: "url(/images/lizard.png)"
      }
    },
    {
      name: "scissors",
      style: {
        background: "url(/images/scissors.png)"
      }
    }
  ];

  constructor(props) {
    super(props);

    this.hoverButtonSound = new Audio("/sound-effects/hover-weapon.mp3");
    this.selectButtonSound = new Audio("/sound-effects/select-weapon.mp3");

    this.state = {
      won: false,
      headerstate: "start",
      weaponChosen: false,
      showStats: false,
      roundCountDown: 5,
      yourWeaponChosen: false,
      enemyWeaponChosen: false,
      draw: false,
      yourWeaponStyle: { backgroundImage: "" },
      enemyWeaponStyle: { backgroundImage: "" }
    };

    const socket = this.props.socket;

    socket.emit("join room", props.match.params.id);
    socket.on("w8ing for another", () => this.w8foranouther());
    socket.on("round result", msg => this.processResult(msg));
    socket.on("no such room", () => this.props.history.push("/"));
    socket.on("room is full", () => this.roomIsFull());
  }

  // Process redirect when room is already full
  roomIsFull() {
    alert("This room is already full");
    this.props.history.push("/");
  }

  // Process chosen weapon
  weaponChosen(name) {
    if (this.state.yourWeaponChosen) {
      return;
    }
    this.selectButtonSound.play();

    this.setState({ weaponChosen: true, showStats: true });

    const socket = this.props.socket;

    socket.emit("chosen weapon", name);

    this.setState({
      yourWeaponStyle: {
        backgroundImage: `url(/images/${name}.png)`
      },
      yourWeaponChosen: true
    });
  }

  // If current user bet first
  w8foranouther() {
    this.setState({ headerstate: "w8foranouther" });
  }

  // Show round results
  processResult(msg) {
    this.setState({ won: msg.won });

    if (msg.draw) {
      this.setState({ draw: msg.draw });
    }

    this.setState({
      enemyWeaponStyle: {
        backgroundImage: `url(/images/${msg.enemyWeapon}.png)`
      },
      enemyWeaponChosen: true
    });

    this.setState({ headerstate: "nextRoundTimer" });

    let counter = 4;

    const roundCountDown = setInterval(() => {
      this.setState({ roundCountDown: counter-- });
    }, 1000);

    setTimeout(() => {
      clearInterval(roundCountDown);
      this.setState({
        headerstate: "nextRoundStarted",
        roundCountDown: 5,
        yourWeaponChosen: false,
        enemyWeaponChosen: false,
        draw: false,
        yourWeaponStyle: { backgroundImage: "" },
        enemyWeaponStyle: { backgroundImage: "" }
      });
    }, 5000);
  }

  // Sound effects
  weaponHoverPlaySound() {
    if (this.state.yourWeaponChosen) {
      return;
    }
    this.hoverButtonSound.play();
  }

  render() {
    return (
      <div className="game-container">
        <div className="header-container">
          {(() => {
            switch (this.state.headerstate) {
              case "start":
                return (
                  <React.Fragment>
                    <h2>Let the battle begin!</h2>
                    <h3>Choose your weapon</h3>
                  </React.Fragment>
                );
              case "w8foranouther":
                return <h3>Waiting another player's choice...</h3>;
              case "nextRoundTimer":
                return <h3>Next round in {this.state.roundCountDown}</h3>;
              case "nextRoundStarted":
                return (
                  <React.Fragment>
                    <h2>Round started</h2>
                    <h3>Choose your weapon</h3>
                  </React.Fragment>
                );
              default:
                return null;
            }
          })()}
        </div>
        <div
          className={
            this.state.yourWeaponChosen ? "disabled weapons" : "weapons"
          }
        >
          {/* Weapon list */}
          {this.weapons.map(weapon => {
            return (
              <div
                onClick={() => this.weaponChosen(weapon.name)}
                onMouseOver={() => this.weaponHoverPlaySound()}
                key={weapon.name}
                style={weapon.style}
                className={weapon.name}
              />
            );
          })}
        </div>
        <div className="result-block">
          {(() => {
            if (this.state.headerstate === "nextRoundTimer") {
              let response = "";
              const draw = this.state.draw;
              if (draw) {
                response = "Draw";
              } else {
                response = this.state.won ? "You won" : "Defeated";
              }
              return <h4 className="result">{response}</h4>;
            }
          })()}

          <div className="stats">
            <div className="your-stats">
              {!this.state.yourWeaponChosen ? (
                <h4>Your weapon</h4>
              ) : (
                <div
                  style={this.state.yourWeaponStyle}
                  className="weaponChosen"
                />
              )}
            </div>
            <div className="divider" />
            <div className="enemy-stats">
              {!this.state.enemyWeaponChosen ? (
                <h4>Enemy's weapon</h4>
              ) : (
                <div
                  style={this.state.enemyWeaponStyle}
                  className="weaponChosen"
                />
              )}
            </div>
          </div>
        </div>
        <Chat socket={this.props.socket} />
      </div>
    );
  }
}

export default GameScreen;
