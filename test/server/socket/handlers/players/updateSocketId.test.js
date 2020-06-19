const { expect } = require('chai');
const sinon = require('sinon');
const ioClient = require('socket.io-client');

const { startServer } = require('../../../../helpers/server');
const ioServer = require('../../../../../src/server/socket/ioInstance');
const config = require('../../../../../src/server/config');

const playersLib = require('../../../../../src/server/models/players');
const changeRoomSocket = require('../../../../../src/server/socket/lib/roomSocket/changeRoomSocket');
const getActiveRooms = require('../../../../../src/server/socket/handlers/rooms/getActiveRooms');

describe('socket/handlers/players/updateSocketId', function() {
    const sandbox = sinon.createSandbox();

    const socketUrl = config.server.url;
    const options = {
        transports: ['websocket'],
        'force new connection': true,
    };

    let server;
    before(cb => {
        startServer(config.server, function(err, srv) {
            server = srv;
            cb();
        });
    });

    after(done => {
        server.stop(done);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should emit socket update result', function(done) {
        const updateStub = sandbox.stub(playersLib, 'updateOne').resolves({ modifiedCount: 1 });
        const changeRoomSocketStub = sandbox.stub(changeRoomSocket, 'change').resolves();
        const getActiveRoomsStub = sandbox.stub(getActiveRooms, 'emitActiveRooms').resolves();

        let socket;
        const io = ioServer.get();
        io.on('connection', _socket => {
            socket = _socket;
        });

        const client = ioClient.connect(socketUrl, options);

        client.emit('players:socket:update', { player_id: '00000000000000000000000d' });
        client.on('players:socket:updated', payload => {
            expect(updateStub.args).to.deep.equal([
                ['00000000000000000000000d', { socket_id: socket.client.id }],
            ]);
            expect(changeRoomSocketStub.args).to.deep.equal([[socket, 'lobby']]);
            expect(getActiveRoomsStub.args).to.deep.equal([[]]);
            expect(payload).to.deep.equal({
                payload: { player_id: '00000000000000000000000d' },
                update: { modifiedCount: 1 },
            });
            client.disconnect();
            done();
        });
    });

    it('should not emit anything if an error occurs while updating the socket id', function(done) {
        const updateStub = sandbox
            .stub(playersLib, 'updateOne')
            .rejects(new Error('something happened'));

        let socket;
        const io = ioServer.get();
        io.on('connection', _socket => {
            socket = _socket;
        });

        const client = ioClient.connect(socketUrl, options);

        client.emit('players:socket:update', { player_id: '00000000000000000000000d' });
        client.on('players:socket:updated', payload => {
            expect(updateStub.args).to.deep.equal([
                ['00000000000000000000000d', { socket_id: socket.client.id }],
            ]);
            expect(payload).to.deep.equal({
                payload: { player_id: '00000000000000000000000d' },
                error: 'Error: something happened',
            });
            client.disconnect();
            done();
        });
    });
});
