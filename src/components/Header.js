import React, { Component } from 'react';
import styled from 'styled-components';
import { Number, Smiley } from './Sprites';

const Container = styled.div`
  display: flex;
  background-color: rgb(192,192,192);
  padding: 3px;
  margin-bottom: 5px;
  border-width: 2px;
  border-color: rgb(255,255,255);
  border-style: solid;
  border-top-color: rgb(123,123,123);
  border-left-color: rgb(123,123,123);
  justify-content: space-between;
  align-items: center;
`;

const TimerContainer = styled.div`
  display: flex;
`;

const BombCounterContainer = styled.div`
  display: flex;
`;

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secondsInGame: 0,
    };

    this.incrementTimer = this.incrementTimer.bind(this);
    this.restartTimer = this.restartTimer.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { gameHasStarted, isGameOver, hasWon } = this.props;

    if (nextProps.isGameOver && !isGameOver) {
      // GAME JUST ENDED
      clearTimeout(this.clockTickTimeoutId);
    } else if (nextProps.hasWon && !hasWon) {
      // JUST WON GAME
      clearTimeout(this.clockTickTimeoutId);
    } else if (gameHasStarted && !nextProps.gameHasStarted) {
      // GAME WAS RESET
      this.restartTimer();
    } else if (nextProps.gameHasStarted && !gameHasStarted) {
      // GAME JUST STARTED!
      setTimeout(this.incrementTimer, 1000);
    }
  }

  restartTimer() {
    clearTimeout(this.clockTickTimeoutId);
    this.setState({ secondsInGame: 0 });
  }

  incrementTimer() {
    this.setState(state => ({ secondsInGame: state.secondsInGame + 1 }));
    this.clockTickTimeoutId = setTimeout(this.incrementTimer, 1000);
  }

  render() {
    const { secondsInGame } = this.state;
    const {
      hasWon,
      isClicking,
      restartGame,
      numOfBombsLeft,
      isGameOver,
    } = this.props;
    return (
      <Container>
        <TimerContainer>
          <Number number={Math.floor((numOfBombsLeft / 100)) % 10} />
          <Number number={Math.floor((numOfBombsLeft / 10)) % 10} />
          <Number number={numOfBombsLeft % 10} />
        </TimerContainer>
        <Smiley
          isOops={isClicking}
          hasLost={isGameOver}
          hasWon={hasWon}
          onClick={() => restartGame()}
        />
        <BombCounterContainer>
          <Number number={Math.floor((secondsInGame / 100)) % 10} />
          <Number number={Math.floor((secondsInGame / 10)) % 10} />
          <Number number={secondsInGame % 10} />
        </BombCounterContainer>
      </Container>
    );
  }
}
