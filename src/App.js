import React, { Component } from "react";
import shuffle from "lodash.shuffle";

import "./App.css";

import Card from "./Card";
import Greeter from "./Greeter";
import GuessCount from "./GuessCount";
import HallOfFame, { FAKE_HOF } from "./HallOfFame";

const SIDE = 6;
const SYMBOLS = "😀🎉💖🎩🐶🐱🦄🐬🌍🌛🌞💫🍎🍌🍓🍐🍟🍿";
const VISUAL_PAUSE_MSECS = 750;

class App extends Component {
  state = {
    cards: this.generateCards(),
    currentPair: [],
    guesses: 0,
    matchedCardIndices: [],
  };

  getHeure() {
    const date = new Date();
    return (
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
      "h" +
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
      ":" +
      (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds())
    );
  }

  generateCards() {
    const result = [];
    const size = SIDE * SIDE;
    const candidates = shuffle(SYMBOLS);
    while (result.length < size) {
      const card = candidates.pop();
      result.push(card, card);
    }
    return shuffle(result);
  }

  handleCardClick = (index) => {
    const { currentPair } = this.state;

    if (currentPair.length === 2) {
      return;
    }
    if (currentPair.length === 0) {
      this.setState({ currentPair: [index] });
      return;
    }

    this.handleNewPairClosedBy(index);
  };

  getFeedbackForCard(index) {
    const { currentPair, matchedCardIndices } = this.state;
    const indexMatched = matchedCardIndices.includes(index);

    if (currentPair.length < 2) {
      return indexMatched || index === currentPair[0] ? "visible" : "hidden";
    }

    if (currentPair.includes(index)) {
      return indexMatched ? "justMatched" : "justMismatched";
    }

    return indexMatched ? "visible" : "hidden";
  }

  handleNewPairClosedBy(index) {
    const { cards, currentPair, guesses, matchedCardIndices } = this.state;
    const newPair = [currentPair[0], index];
    const newGuess = guesses + 1;
    const matched = cards[newPair[0]] === cards[newPair[1]];
    this.setState({ currentPair: newPair, guesses: newGuess });

    if (matched) {
      this.setState({
        matchedCardIndices: [...matchedCardIndices, ...newPair],
      });
    }
    setTimeout(() => this.setState({ currentPair: [] }), VISUAL_PAUSE_MSECS);
  }

  /* test */
  render() {
    const { cards, guesses, matchedCardIndices } = this.state;
    const won = matchedCardIndices.length === cards.length;
    return (
      <div>
        <div className="memory">
          <GuessCount guesses={guesses} />
          {cards.map((card, index) => (
            <Card
              card={card}
              feedback={this.getFeedbackForCard(index)}
              index={index}
              key={index}
              onClick={this.handleCardClick}
            />
          ))}
        </div>
        <div className="alignCenter">
          <p>
            <Greeter whom={"Monsieur"} />
          </p>
          {won && <HallOfFame entries={FAKE_HOF} />}
          <p className="textRouge">{this.getHeure()}</p>
        </div>
      </div>
    );
  }
}

export default App;
