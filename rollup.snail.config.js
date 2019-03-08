import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
	input: 'src/snail/snail.js',
	name: 'Bridge.snail',
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
		{ file: 'dist/bridge.snail.es.js', format: 'es' },
		{ file: 'dist/bridge.snail.iife.js', format: 'iife' }
    ]
};