import { connect } from 'react-redux';

import Home from '../components/Home/Home';

import { store } from '../index';

import {
    emitCreatePlayer,
    onPlayerCreated,
    checkUserCookie,
} from '../actions/players/createPlayer';

const mapStateToProps = state => {
    console.debug('[Home][mapStateToProps] State', state);
    return { players: state.play.players, user: state.usr };
};

const mapDispatchToProps = dispatch => {
    return {
        checkUserCookie,
        emitCreatePlayer,
        listen: () => {
            onPlayerCreated(store);
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);