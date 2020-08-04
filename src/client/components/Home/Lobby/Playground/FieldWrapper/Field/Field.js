import React, { useState, useEffect } from 'react';

import { StyledField, Row } from './Field.style';
import Cell from './Cell/Cell';
import FieldMask from './FieldMask/FieldMask';

const buildField = field => {
    return field.map((row, i) => (
        <Row key={`row_${i}`}>
            {row.map((cell, x) => (
                <Cell key={x} type={cell[0]} projection={cell[2]} />
            ))}
        </Row>
    ));
};

const Field = ({ field, gameStatus }) => {
    if (!field) return null;

    const [content, setContent] = useState();
    useEffect(() => {
        if (gameStatus.gameOver) {
            setContent('Game over');
        } else if (gameStatus.gameWon) {
            setContent('Winner');
        } else {
            setContent('');
        }
    }, [gameStatus.gameOver, gameStatus.gameWon]);

    return (
        <StyledField>
            <FieldMask isGameOver={gameStatus.gameOver} content={content} />
            {buildField(field)}
        </StyledField>
    );
};

export default Field;
