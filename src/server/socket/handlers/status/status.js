'use strict';

const Joi = require('@hapi/joi');

const helpers = require('../../eventHelpers');
const ioInstance = require('../../ioInstance');

const playersLib = require('../../../models/players');

const schema = {
    player_id: Joi.string().required(),
    room_id: Joi.string().required(),
};

const ON_EVENT = 'status:gameOver';
const EMIT_EVENT_GAMEOVER = 'status:gameOver:broadcast';
const EMIT_EVENT_GAMEWON = 'status:gameWon';
const FUNCTION_NAME = '[playersLib]';

const emitGameOver = async (socket, payload) => {
    const io = ioInstance.get();

    try {
        io.to(payload.room_id).emit(EMIT_EVENT_GAMEOVER, payload);
    } catch (err) {
        socket.emit(EMIT_EVENT_GAMEOVER, { payload, error: err.toString() });
        console.error(FUNCTION_NAME, { payload, err });
    }
};

const emitGameWon = async (socket, payload) => {
    const io = ioInstance.get();
    const [playerId, roomId] = [payload.player_id, payload.room_id];

    try {
        await playersLib.updateOne(playerId, { game_over: true });
        const playersCursor = await playersLib.find({ room_id: roomId });
        const players = await playersCursor.toArray();

        let isNotGameOver = 0;
        let winnerSocketId = null;
        for (const player of players) {
            if (!player.game_over) {
                isNotGameOver++;
                winnerSocketId = player.socket_id;
            }
        }

        if (isNotGameOver === 1) {
            io.to(winnerSocketId).emit(EMIT_EVENT_GAMEWON);
            console.log('[socket event emited][to:', winnerSocketId, ']', EMIT_EVENT_GAMEWON);
        }
    } catch (err) {
        socket.emit(EMIT_EVENT_GAMEWON, { payload, error: err.toString() });
        console.error(FUNCTION_NAME, { payload, err });
    }
};

export const handleWinner = helpers.createEvent(
    ON_EVENT,
    EMIT_EVENT_GAMEOVER,
    schema,
    async (socket, payload) => {
        await emitGameOver(socket, payload);
        await emitGameWon(socket, payload);
    },
);
