export const extractToken = (header: string): string | null => {
  const [prefix, token] = header.split(' ');
  return prefix != 'Basic' ? null : token;
};
