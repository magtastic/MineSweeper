import React from 'react';
import styled from 'styled-components';
import spriceSrc from '../assets/minesweeper_sprite.png';
import {
  SPRITE_PADDING,
  EDGE_PADDING,
  NUMBER_WIDTH,
  NUMBER_HEIGHT,
  SMILEY_WIDTH,
  SMILEY_HEIGHT,
  TILE_WIDTH,
  TILE_HEIGHT,
} from '../constants/Layout';

// TODO: ADD THIS IN LAYOUT

const NumberSprite = styled.div`
  width: ${NUMBER_WIDTH}px;
  height: ${NUMBER_HEIGHT}px;
  background: url(${spriceSrc});
  background-position: left -${props => ((SPRITE_PADDING + NUMBER_WIDTH) * props.index) + EDGE_PADDING}px top -${EDGE_PADDING}px;
  background-repeat: no-repeat;
`;

const SmileySprite = styled.div`
  width: ${SMILEY_WIDTH}px;
  height: ${SMILEY_HEIGHT}px;
  background: url(${spriceSrc});
  background-position: left -${(props) => {
    if (props.isCliked) return EDGE_PADDING + (SMILEY_WIDTH + SPRITE_PADDING) * 1;
    if (props.isOops) return EDGE_PADDING + (SMILEY_WIDTH + SPRITE_PADDING) * 2;
    if (props.hasWon) return EDGE_PADDING + (SMILEY_WIDTH + SPRITE_PADDING) * 3;
    if (props.hasLost) return EDGE_PADDING + (SMILEY_WIDTH + SPRITE_PADDING) * 4;
    if (props.isNumber) {
      return EDGE_PADDING;
    }
    return EDGE_PADDING;
  }}px top -${EDGE_PADDING + NUMBER_HEIGHT + SPRITE_PADDING}px;
  background-repeat: no-repeat;
`;

const TileSprite = styled.div`
  width: ${TILE_WIDTH}px;
  height: ${TILE_HEIGHT}px;
  background: url(${spriceSrc});
  background-position: left -${(props) => {
    if (props.isBlank) return EDGE_PADDING + (TILE_WIDTH + SPRITE_PADDING) * 1;
    if (props.isFlag) return EDGE_PADDING + (TILE_WIDTH + SPRITE_PADDING) * 2;
    if (props.isQuestion) return EDGE_PADDING + (TILE_WIDTH + SPRITE_PADDING) * 3;
    if (props.isBlankQuestion) return EDGE_PADDING + (TILE_WIDTH + SPRITE_PADDING) * 4;
    if (props.isBomb) return EDGE_PADDING + (TILE_WIDTH + SPRITE_PADDING) * 5;
    if (props.isHitBomb) return EDGE_PADDING + (TILE_WIDTH + SPRITE_PADDING) * 6;
    if (props.isFalslyMarked) return EDGE_PADDING + (TILE_WIDTH + SPRITE_PADDING) * 7;
    if (props.isNumber) return EDGE_PADDING + (TILE_WIDTH + SPRITE_PADDING) * (props.number - 1);
    return EDGE_PADDING;
  }}px top -${props => (props.isNumber /* eslint-disable indent */
    ? EDGE_PADDING + NUMBER_HEIGHT + (SPRITE_PADDING * 3) + SMILEY_HEIGHT + TILE_HEIGHT
    : EDGE_PADDING + NUMBER_HEIGHT + (SPRITE_PADDING * 2) + SMILEY_HEIGHT
  )/* eslint-enable indent */}px;
  background-repeat: no-repeat;
`;

// TODO: MAKE SOMETHING LIKE THIS, BUT FOR CELLS, BORDERS, ECT.
export const Number = ({ number }) => (
  <NumberSprite index={number === 0 ? 9 : number - 1} />
);

export const Smiley = props => (
  <SmileySprite {...props} />
);

export const Tile = props => (
  <TileSprite {...props} />
);
