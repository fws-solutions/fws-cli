import { getMessageBasedOnCode } from '../util/getMessageBasedOnCode';

describe('util/handleProcessResult - testing log messages', () => {
    it('should log correct message on success', () => {
        const message = getMessageBasedOnCode(0, 'test');
        expect(message).toEqual('test succeeded!');
    });
    it('should log correct message on failure', () => {
        const message = getMessageBasedOnCode(1, 'test');
        expect(message).toEqual('test failed!');
    });
    it('should log correct message on default', () => {
        const message = getMessageBasedOnCode(5, 'test');
        expect(message).toEqual('test exited with code 5');
    });
});
