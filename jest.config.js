module.exports = {
    roots: ['build'],
    moduleDirectories: [
        'node_modules', 'dist'
    ],
    transform: {
        '\\.wasm$': './test/jestFileTransformer.js',
    },
    testEnvironment: 'node',
    testTimeout: 10000,
}