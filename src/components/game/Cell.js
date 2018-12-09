import React, { Component } from 'react';
import styled from 'styled-components';
import { Tile } from './Sprites';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default class Cell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isBeingCliked: false,
    };

    this.renderContent = this.renderContent.bind(this);
  }

  renderContent() {
    const {
      isMine,
      isHitMine,
      numOfMinesAround,
      isMarked,
      isHidden,
      isQuestionMarked,
      isFalslyMarked,
    } = this.props;
    const { isBeingCliked } = this.state;


    if (isFalslyMarked) return <Tile isFalslyMarked />;

    if (isMarked) return <Tile isFlag />;

    if (isQuestionMarked) return <Tile isQuestion />;

    if (isHitMine) return <Tile isHitBomb />;

    if (isHidden) return <Tile />;

    if (isMine) return <Tile isBomb />;

    if (numOfMinesAround === 0) return <Tile isBlank />;

    if (isBeingCliked && isQuestionMarked) return <Tile isBlankQuestion />

    if (isBeingCliked) return <Tile isBlank />;

    return <Tile isNumber number={numOfMinesAround} />;
  }

  render() {
    const {
      isMine,
      isHidden,
      onRightClick,
      onLeftClick,
      isClicking,
    } = this.props;

    return (
      <Container
        isMine={isMine}
        onMouseDown={() => {
          if (isHidden) {
            this.setState({ isBeingCliked: true });
          }
          isClicking(true);
        }}
        onMouseUp={() => {
          if (isHidden) {
            this.setState({ isBeingCliked: false });
          }
          isClicking(false);
        }}
        onClick={() => onRightClick(this.props)}
        onContextMenu={() => onLeftClick(this.props)}
        isHidden={isHidden}
      >
        {this.renderContent()}
      </Container>
    );
  }
}
