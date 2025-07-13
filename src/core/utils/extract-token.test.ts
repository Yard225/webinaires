import { extractToken } from './extract-token';

describe('Feature: extract tokn from headers', () => {
  it('should return the token', async () => {
    expect(extractToken('Basic 123')).toBe('123');
    expect(extractToken('Test 123')).toBeNull();
    expect(extractToken('123123')).toBeNull();
    expect(extractToken('')).toBeNull();
  });
});
