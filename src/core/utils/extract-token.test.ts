import { extractToken } from './extract-token';

describe(' Test suite', () => {
  it('should be defined', () => {
    expect(extractToken('Basic 123')).toBe('123');
    expect(extractToken('Test 123')).toBeNull();
    expect(extractToken('123123')).toBeNull();
    expect(extractToken('')).toBeNull();
  });
});
