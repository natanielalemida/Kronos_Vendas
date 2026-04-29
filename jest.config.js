module.exports = {
  preset: 'react-native',
  rootDir: '.',
  roots: ['<rootDir>/src'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/android/',
    '/ios/',
    '/\\.claude/',
  ],
};
