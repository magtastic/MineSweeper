import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  flex: 1;
  background-color: orange;
`;

const TempText = styled.h1`
  font-size: 38;
`;

export default class HighScore extends Component {
  render() {
    return (
      <Container>
        <TempText>
          Yo, I am highscore screen.
        </TempText>
      </Container>
    )
  }
}
