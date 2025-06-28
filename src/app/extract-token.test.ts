import { extractToken } from './extract-token';

describe('Feature: extract token', () => {
  it('should extract the token', async () => {
    expect(extractToken('Basic 123')).toEqual('123');
    expect(extractToken('Test 123')).toBeNull();
    expect(extractToken('123 123')).toBeNull();
    expect(extractToken('')).toBeNull();
  });
});
