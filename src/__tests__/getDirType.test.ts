import { getDirType } from '../util/getDirType';

describe('util/getDirType - testing get dir type', () => {
    it('should return "block" for "block" type', () => {
        const type = 'block';
        const result = getDirType(type);
        expect(result).toBe('block');
    });

    it('should return "block" for "blockVue" type', () => {
        const type = 'blockVue';
        const result = getDirType(type);
        expect(result).toBe('block');
    });

    it('should return "listing" for "listing" type', () => {
        const type = 'listing';
        const result = getDirType(type);
        expect(result).toBe('listing');
    });

    it('should return "part" for "part" type', () => {
        const type = 'part';
        const result = getDirType(type);
        expect(result).toBe('part');
    });

    it('should return "part" for "partVue" type', () => {
        const type = 'partVue';
        const result = getDirType(type);
        expect(result).toBe('part');
    });

    it('should return empty string if type is not recognized', () => {
        const type = 'unknownType';
        const result = getDirType(type);
        expect(result).toBe('');
    });

    it('should return empty string if type is an empty string', () => {
        const type = '';
        const result = getDirType(type);
        expect(result).toBe('');
    });
});
