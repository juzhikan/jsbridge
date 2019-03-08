import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'src/read/read.js',
    name: 'Bridge.read',
    plugins: [
        commonjs({

        }),
        resolve({
            main: true
        }),
      babel({
        exclude: 'node_modules/**',
        externalHelpers: false,
        externalHelpersWhitelist: ['inherits','classCallCheck','possibleConstructorReturn','createClass','typeof']
      })
    ],
    output: [
        { file: 'dist/bridge.read.es.js', format: 'es' },
        { file: 'dist/bridge.read.iife.js', format: 'iife' }
    ]
};
