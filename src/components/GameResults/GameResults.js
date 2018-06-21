import React, { Component } from "react";
import "./GameResults.css";

class GameResults extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
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
            <div style={this.state.yourWeaponStyle} className="weaponChosen" />
          )}
        </div>
        <div className="divider" />
        <div className="enemy-stats">
          {!this.state.enemyWeaponChosen ? (
            <h4>Enemy's weapon</h4>
          ) : (
            <div style={this.state.enemyWeaponStyle} className="weaponChosen" />
          )}
        </div>
      </div>
    </div>;
  }
}

export default GameResults;
