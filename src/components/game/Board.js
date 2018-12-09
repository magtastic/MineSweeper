import React, { Component } from 'react';
import styled from 'styled-components';
import Header from './Header';
import Cell from './Cell';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: rgb(189,189,189);
  border-width: 2px;
  border-color: rgb(255,255,255);
  border-style: solid;
  border-bottom-color: rgb(123,123,123);
  border-right-color: rgb(123,123,123);
  padding: 5px;
`;

const TilesContainer = styled.div`
  border-width: 2px;
  border-color: rgb(255,255,255);
  border-style: solid;
  border-top-color: rgb(123,123,123);
  border-left-color: rgb(123,123,123);
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getMinesAroundCountForCellInBoard(cell, board) {
  const { cords, isMine } = cell;

  let count = 0;

  if (isMine) return count;

  for (let y = cords.y - 1; y <= cords.y + 1; y += 1) {
    for (let x = cords.x - 1; x <= cords.x + 1; x += 1) {
      if (
        (y >= 0)
        && (y < board.length)
        && (x >= 0)
        && (x < board[0].length)
      ) {
        if (board[y][x].isMine) count += 1;
      }
    }
  }

  return count;
}

function createInitialBoardState(props) {
  const {
    rowCount,
    columnCount,
    numOfMines,
  } = props;


  // Place random mines
  const minesLocatoinIds = [];
  while (minesLocatoinIds.length < numOfMines) {
    const y = getRandomInt(0, rowCount - 1);
    const x = getRandomInt(0, columnCount - 1);
    const mineLocationId = `${x}${y}`;
    if (!minesLocatoinIds.includes(mineLocationId)) {
      minesLocatoinIds.push(mineLocationId);
    }
  }

  // GenerateBoard
  const initialBoard = [];
  for (let y = 0; y < rowCount; y += 1) {
    const row = [];
    for (let x = 0; x < columnCount; x += 1) {
      const id = `${x}${y}`;
      row.push({
        id,
        isHidden: true,
        isMarked: false,
        isMine: minesLocatoinIds.includes(id),
        cords: { x, y },
      });
    }
    initialBoard.push(
      row,
    );
  }

  const board = [];
  for (let y = 0; y < rowCount; y += 1) {
    const row = [];
    const initialRow = initialBoard[y];
    for (let x = 0; x < columnCount; x += 1) {
      const cell = initialRow[x];
      row.push({
        ...cell,
        numOfMinesAround: getMinesAroundCountForCellInBoard(cell, initialBoard),
      });
    }
    board.push(row);
  }

  return board;
}

export default class Board extends Component {
  constructor(props) {
    super(props);

    const board = createInitialBoardState(props);

    this.state = {
      board,
      isClicking: false,
      gameHasStarted: false,
      numOfBombsLeft: props.numOfMines,
      isGameOver: false,
      hasWon: false,
    };

    this.restartGame = this.restartGame.bind(this);
    this.handleCellClicked = this.handleCellClicked.bind(this);
    this.handleCellLeftClicked = this.handleCellLeftClicked.bind(this);
    this.setStateOfCellQuestionMarked = this.setStateOfCellQuestionMarked.bind(this);
    this.setStateOfCellHidden = this.setStateOfCellHidden.bind(this);
    this.setStateOfCellMarked = this.setStateOfCellMarked.bind(this);
    this.setStateOfMineClicked = this.setStateOfMineClicked.bind(this);
    this.setStateOfVoidAsClicked = this.setStateOfVoidAsClicked.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { gameId } = this.props;

    if (gameId !== nextProps.gameId) {
      const board = createInitialBoardState(nextProps);
      this.setState({
        board,
        gameHasStarted: false,
        numOfBombsLeft: nextProps.numOfMines,
        isGameOver: false,
        isClicking: false,
        hasWon: false,
      })
    }
  }

  setStateOfMineClicked(cell) {
    const { cords, isMine } = cell;
    const { x, y } = cords;

    this.setState((state) => {
      const newBoard = state.board
        .map(row => row
          .map(tile => {
            if (tile.isMarked && !tile.isMine) {
              return {
                ...tile,
                isFalslyMarked: true,
              }
            }
            return tile.isMine
              ? { ...tile, isHidden: false, isMarked: false, isQuestionMarked: false }
              : { ...tile }
          }));
      newBoard[y][x].isHitMine = true;
      return {
        ...state,
        board: newBoard,
        isGameOver: isMine,
      };
    });
  }

  setStateOfCellClicked(cell) {
    const { cords, isMine } = cell;
    const { x, y } = cords;

    this.setState((state) => {
      const newBoard = [...state.board];
      newBoard[y][x].isHidden = false;
      return {
        ...state,
        gameHasStarted: true,
        board: newBoard,
        isGameOver: isMine,
      };
    }, this.hasWonCheck);
  }

  setStateOfCellHidden(cell) {
    const { cords } = cell;
    const { x, y } = cords;

    this.setState((state) => {
      const newBoard = [...state.board];
      newBoard[y][x].isMarked = false;
      newBoard[y][x].isQuestionMarked = false;
      return {
        ...state,
        board: newBoard,
      };
    });
  }

  setStateOfCellQuestionMarked(cell) {
    const { cords } = cell;
    const { x, y } = cords;

    this.setState((state) => {
      const newBoard = [...state.board];
      newBoard[y][x].isMarked = false;
      newBoard[y][x].isQuestionMarked = true;
      return {
        ...state,
        numOfBombsLeft: state.numOfBombsLeft + 1,
        board: newBoard,
      };
    });
  }

  setStateOfCellMarked(cell) {
    const { cords } = cell;
    const { x, y } = cords;

    this.setState((state) => {
      const newBoard = [...state.board];
      newBoard[y][x].isMarked = true;
      newBoard[y][x].isQuestionMarked = false;
      return {
        ...state,
        numOfBombsLeft: state.numOfBombsLeft - 1,
        board: newBoard,
      };
    });
  }

  setStateOfVoidAsClicked(cell, checkedCells) {
    const { cords, id, numOfMinesAround } = cell;
    // If we have checked this cell, return all the checked cells
    if (checkedCells.includes(id)) return checkedCells;

    // Check the cell.
    this.setStateOfCellClicked(cell);
    checkedCells.push(cell.id);

    // If this is an edge return all the checked cell (including the current cell)
    if (numOfMinesAround !== 0) return checkedCells;

    const { board } = this.state;

    let currCheckedCells = checkedCells;

    // Check all surrounding cells
    for (let y = cords.y - 1; y <= cords.y + 1; y += 1) {
      for (let x = cords.x - 1; x <= cords.x + 1; x += 1) {
        // Check if cell is on board (this can be done in the for loop statement)
        if (
          (y >= 0)
          && (y < board.length)
          && (x >= 0)
          && (x < board[0].length)
          && !(x === cords.x && y === cords.y)
        ) {
          // Check the surrounding cell, get all the cells that it checked, recursivly
          currCheckedCells = this.setStateOfVoidAsClicked(board[y][x], currCheckedCells);
        }
      }
    }

    // return all the cells that we checked
    return currCheckedCells;
  }

  hasWonCheck() {
    const { board } = this.state;
    let hasWon = true;

    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell.isHidden && !cell.isMine) {
          hasWon = false;
        }
      });
    });

    if (hasWon) {
      this.setState((state) => {
        const newBoard = state.board
          .map(row => row
            .map(cell => ({
              ...cell,
              isMarked: cell.isMine,
              isHidden: cell.isMine,
            })));
        return {
          ...state,
          board: newBoard,
          numOfBombsLeft: 0,
          hasWon,
        };
      });
    }
  }


  restartGame() {
    const board = createInitialBoardState(this.props);
    const { numOfMines } = this.props;

    this.setState({
      board,
      numOfBombsLeft: numOfMines,
      gameHasStarted: false,
      hasWon: false,
      isClicking: false,
      isGameOver: false,
    });
  }

  handleCellLeftClicked(cell) {
    if (cell.isHidden) {
      if (cell.isMarked) {
        this.setStateOfCellQuestionMarked(cell);
      } else if (cell.isQuestionMarked) {
        this.setStateOfCellHidden(cell);
      } else {
        this.setStateOfCellMarked(cell);
      }
    }
  }

  handleCellClicked(cell) {
    const {
      isHidden,
      isMine,
      numOfMinesAround,
      isMarked,
    } = cell;

    if (!isMarked) {
      if (isMine) {
        this.setStateOfMineClicked(cell);
        this.setState({ isGameOver: true });
      } else if (isHidden) {
        // if the cell has no surrounding mines,
        // and is not a mine, then it is a "void"
        if (!isMine && numOfMinesAround === 0) {
          this.setStateOfVoidAsClicked(cell, []);
        } else {
          this.setStateOfCellClicked(cell);
        }
      }
    }
  }

  render() {
    const {
      board,
      isGameOver,
      gameHasStarted,
      numOfBombsLeft,
      hasWon,
      isClicking,
    } = this.state;
    return (
      <Container>
        <Header
          isClicking={isClicking}
          isGameOver={isGameOver}
          restartGame={this.restartGame}
          gameHasStarted={gameHasStarted}
          numOfBombsLeft={numOfBombsLeft}
          hasWon={hasWon}
        />
        <TilesContainer>
          {board.map(row => (
            <Row key={row[0].id}>
              {
                row.map(cell => (
                  <Cell
                    isClicking={(isClicking) => this.setState({ isClicking })}
                    onRightClick={isGameOver ? () => { } : this.handleCellClicked}
                    onLeftClick={isGameOver ? () => { } : this.handleCellLeftClicked}
                    key={cell.id}
                    {...cell}
                  />
                ))
              }
            </Row>
          ))}
        </TilesContainer>
      </Container>
    );
  }
}
