import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import { emitCreatePlayer, onPlayerCreated } from '../actions/createPlayer';

import { store } from '../index';

let history = [];

const goToPlayground = () => {
    history.push({ pathname: '/playground' });
};

const goToRooms = () => {
    history.push({ pathname: '/rooms' });
};

const Home = ({ players, user, ...dispatchs }) => {
    useEffect(() => {
        dispatchs.listen();
    }, []);

    useEffect(() => {
        if (user && user.id) return goToRooms();
    }, [user]);

    history = useHistory();

    const createPlayer = event => {
        if (event.key === 'Enter') {
            dispatchs.emitCreatePlayer(store.dispatch, event.target.value);
        }
    };

    return (
        <div>
            <label>Create player:</label>
            <input type="text" id="name" onKeyDown={createPlayer} required />
            <br />
            <Button variant="primary" onClick={goToRooms}>
                Rooms
            </Button>
            <br />
            <br />
            <Button variant="primary" onClick={goToPlayground}>
                Playground
            </Button>
        </div>
    );
};

const mapStateToProps = state => {
    console.debug('[Home][mapStateToProps] State', state);
    return { players: state.play.players, user: state.usr };
};

const mapDispatchToProps = dispatch => {
    return {
        emitCreatePlayer,
        listen: () => {
            onPlayerCreated(dispatch);
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
