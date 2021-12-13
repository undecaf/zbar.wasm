import commonjs from '@rollup/plugin-commonjs'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import ts from 'rollup-plugin-ts'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const plugins = [
    ts(),         // this just works, much preferred over @rollup/plugin-typescript
    commonjs(),   // converts zbar.js to an ES6 module that can be imported
    terser(),
]

export default [
    {
        // ES6 module and <script type="module">
        input: 'src/index.ts',
        output: {
            file: pkg.module,
            format: 'esm',
            generatedCode: 'es2015',
            sourcemap: true,
        },
        external: ['path', 'fs', './zbar.wasm'],
        plugins,
    },

    {
        // Plain <script>
        input: 'src/index.ts',
        output: {
            file: pkg.unpkg,
            format: 'iife',
            generatedCode: 'es2015',
            sourcemap: true,
            globals: id => id,
            name: 'zbar',
        },
        external: ['./zbar.wasm'],
        plugins: [nodePolyfills(), ...plugins],
    },

    {
        // CommonJS (Node, Jest)
        input: 'src/index.ts',
        output: {
            file: pkg.main,
            format: 'cjs',
            generatedCode: 'es2015',
            sourcemap: true,
        },
        external: ['path', 'fs', './zbar.wasm'],
        plugins,
    }
]
