'use strict';

import notify from '../actions/notifications';

const handleError = (state, error, errorFieldName) => {
    const filename = path.basename(this.filename);
    console.error(`[room reducer][${errorFieldName}]`, error);
    return {
        ...state,
        [errorFieldName]: error,
    };
};

const checkAndUpdatePlayersNames = (playerState, rooms, fnUpdatePlayers, dispatch) => {
    if (!rooms) return;

    let idsChecked = [];
    rooms.forEach(room => {
        let arePlayersMissing = false;

        room.players_ids.forEach(playerId => {
            const isAlreadyChecked = idsChecked.includes(playerId);
            const isInState = playerState && playerState[playerId];

            if (!isAlreadyChecked && !isInState) {
                arePlayersMissing = true;
                return;
            }
        });

        if (arePlayersMissing === true) {
            fnUpdatePlayers(dispatch, room._id);
            idsChecked = [...idsChecked, ...room.players_ids];
        }
    });
};

const handleUpdateActiveRooms = (state, action) => {
    if (action.error !== undefined) {
        notify({ type: 'error', msg: action.error });
        return handleError(state, action.error, 'updateRoomsError');
    }

    checkAndUpdatePlayersNames(
        state.players,
        action.rooms,
        action.fnUpdatePlayers,
        action.dispatch,
    );
    return {
        ...state,
        rooms: action.rooms,
        updateRoomsError: null,
    };
};

const handleRoomCreation = (state, action) => {
    if (action.error !== undefined) {
        notify({ type: 'error', msg: action.error });
        return handleError(state, action.error, 'roomCreationError');
    }

    return { ...state, roomCreationError: null };
};

const handleRoomJoined = (state, action) => {
    if (action.error !== undefined) {
        notify({ type: 'error', msg: 'Error:\nImpossible to create the room\n' + action.error });
        return handleError(state, action.error, 'roomJoinedError');
    }

    return { ...state, roomJoinedError: null };
};

const reducer = (state = {}, action) => {
    switch (action.type) {
        case 'UPDATE_ACTIVE_ROOMS':
            return handleUpdateActiveRooms(state, action);
        case 'ROOM_CREATED':
            return handleRoomCreation(state, action);
        case 'ROOM_JOINED':
            return handleRoomJoined(state, action);
        default:
            return state;
    }
};

export default reducer;
