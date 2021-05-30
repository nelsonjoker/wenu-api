
const authorize = require('../auth/middleware/authorize');

describe('authorize', () => {
    it('should return an array with 2 middleware functions', () => {
        const r = authorize('test');
        expect(r.length).toBe(2);
    });
})