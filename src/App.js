import React, { Component } from 'react';
import styled from 'styled-components';
import Board from './components/Board';

/*

TODO: add check if running electron.

const electron = window.require('electron');
const fs = electron.remote.require('fs');
const { ipcRenderer } = electron; 
*/

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
    /*          
    TODO: add check if running electron.
    ipcRenderer.on('LEVEL_DATA', (event, data) => {
      this.setState(state => ({
        ...data,
        gameId: state.gameId + 1
      }));
    });  
    */
  }

  render() {
    return (
      <Container>
        <Board {...this.state} />
      </Container>
    );
  }
}

export default App;
