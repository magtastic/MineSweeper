import React, { Component } from 'react';
import styled from 'styled-components';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import Board from './components/game/Board';
import HighScore from './components/highscore/index';
import LevelCreation from './components/levelCreation/index';

const electron = window.require('electron');
const { ipcRenderer } = electron;

const Container = styled.div``;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId: 0,
      rowCount: 9,
      columnCount: 9,
      numOfMines: 9
    };

    this.listenToLevelChanges = this.listenToLevelChanges.bind(this);
  }

  componentDidMount() {
    this.listenToLevelChanges();
  }

  listenToLevelChanges() {
    ipcRenderer.on('LEVEL_DATA', (event, data) => {
      this.setState(state => ({
        ...data,
        gameId: state.gameId + 1
      }));
    });
  }

  render() {
    return (
      <Router>
        <Container>
          <Route exact path='/' render={routeProps => <Board {...routeProps} {...this.state} />} />
          <Route path='/highscore' render={routeProps => <HighScore {...routeProps} />} />
          <Route path='/level' render={routeProps => <LevelCreation {...routeProps} />} />
        </Container>
      </Router>
    );
  }
}

export default App;
