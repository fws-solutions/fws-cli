import { isWin } from '../util/isWin';
describe('util/isWin - platform test', () => {
    it('should return true if platform is win32', () => {
        Object.defineProperty(process, 'platform', {
            value: 'win32',
        });
        const result = isWin();
        expect(result).toBe(true);
    });
    it('should return false if platform is linux/mac', () => {
        const currentPlatform = process.platform;
        Object.defineProperty(process, 'platform', {
            value: 'mockOS',
        });
        const result = isWin();
        Object.defineProperty(process, 'platform', {
            value: currentPlatform,
        });
        expect(result).toBe(false);
    });
});
