module.exports = {
  verbose: true,
  bail: true,
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  snapshotSerializers: ['enzyme-to-json/serializer']
}
