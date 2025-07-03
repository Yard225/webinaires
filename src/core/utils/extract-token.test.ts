import { extractToken } from './extract-token';

describe('Feature: Extract Token from Headers', () => {
  it('should extract the token only', async () => {
    expect(extractToken('Basic 123')).toBe('123');
    expect(extractToken('Test 123')).toBeNull();
    expect(extractToken('123123')).toBeNull();
    expect(extractToken('')).toBeNull();
  });
});
