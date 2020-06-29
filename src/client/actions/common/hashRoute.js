'use strict';

import { emitCreatePlayerAndRoom } from './createPlayerAndRoom';

const parseHash = hash => {
    const regexp = /^\#([\w-_ ]+)\[([\w-_ ]+)\]$/;
    const matches = regexp.exec(hash);

    return {
        room: matches && matches[1],
        player: matches && matches[2],
    };
};

export const handleHashRoute = (store, hash) => {
    console.log('ENTERED IN HANDLE_HASH_ROUTE :((((((');
    const userState = store.getState().usr;
    if (userState.roomId) return;

    const names = parseHash(hash);
    if (names.player && names.room) {
        emitCreatePlayerAndRoom(store.dispatch, names.player, names.room);
    }
};
