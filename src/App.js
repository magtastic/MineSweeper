import React, { Component } from 'react';
import styled from 'styled-components';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import Board from './components/game/Board';
import HighScore from './components/highscore/index';
import LevelCreation from './components/levelCreation/index';
import { isElectron } from './utils';

let ipcRenderer;
if (isElectron()) {
  const electron = window.require('electron');
  ipcRenderer = electron.ipcRenderer;
}

const Container = styled.div``;

const WebButtonsContainer = styled.div`
  display: 'flex';
  flex-direction: 'column';
`;

const WebButton = styled.div`
  border: solid black 1px;
  border-radius: 10;
  cursor: pointer;
`;

const WebButtonText = styled.p`
  text-align: center;
`;

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
    if (isElectron()) {
      ipcRenderer.on('LEVEL_DATA', (event, data) => {
        this.setState(state => ({
          ...state,
          ...data,
          gameId: state.gameId + 1
        }));
      });
    }
  }

  render() {
    return (
      <Router>
        <Container>
          <Route exact path='/' render={routeProps =>
            isElectron() ? (
              <Board {...routeProps} {...this.state} />
            ) : (
                <React.Fragment>
                  <Board {...routeProps} {...this.state} />
                  <WebButtonsContainer>
                    <WebButton onClick={() => this.setState(state => ({
                      ...state,
                      gameId: state.gameId + 1,
                      rowCount: 9,
                      columnCount: 9,
                      numOfMines: 10,
                    }))}>
                      <WebButtonText>
                        Beginner
                    </WebButtonText>
                    </WebButton>
                    <WebButton onClick={() => this.setState(state => ({
                      ...state,
                      gameId: state.gameId + 1,
                      rowCount: 16,
                      columnCount: 16,
                      numOfMines: 40,
                    }))}>
                      <WebButtonText>
                        Intermediate
                    </WebButtonText>
                    </WebButton>
                    <WebButton onClick={() => this.setState(state => ({
                      ...state,
                      gameId: state.gameId + 1,
                      rowCount: 16,
                      columnCount: 30,
                      numOfMines: 99,
                    }))}>
                      <WebButtonText>
                        Advanced
                    </WebButtonText>
                    </WebButton>
                  </WebButtonsContainer>
                </React.Fragment>
              )
          } />
          <Route path='/highscore' render={routeProps => <HighScore {...routeProps} />} />
          <Route path='/level' render={routeProps => <LevelCreation {...routeProps} />} />
        </Container>
      </Router>
    );
  }
}

export default App;
