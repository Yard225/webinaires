export const extractToken = (headers: string): string | null => {
  const [prefix, token] = headers.split(' ');
  return prefix !== 'Basic' ? null : token;
};
