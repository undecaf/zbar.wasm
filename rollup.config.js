import commonjs from '@rollup/plugin-commonjs'
import multi from '@rollup/plugin-multi-entry'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'


const plugins = [
    multi(),
    typescript({
        include: ["./src/**/*"],
        exclude: ["./tests/**/*"],
    }),
    resolve(),
    commonjs(),
    terser(),
]


export default [
    {
        // ES module
        input: ['src/module.ts', 'src/instance.ts', 'src/enum.ts', 'src/Image.ts', 'src/ImageScanner.ts', 'src/Symbol.ts', 'dist/zbar.js'],
        output: {
            file: pkg.module,
            format: 'es',
            sourcemap: true,
        },
        plugins,
    },

    {
        // Universal module (AMD, CommonJS, browser)
        input: ['src/module.ts', 'src/instance.ts', 'src/enum.ts', 'src/Image.ts', 'src/ImageScanner.ts', 'src/Symbol.ts', 'dist/zbar.bin.js'],
        output: {
            file: pkg.main,
            format: 'umd',
            sourcemap: true,
            globals: id => id,
            name: 'ZbarWasm',
        },
        plugins: [nodePolyfills(), ...plugins],
    },
]
