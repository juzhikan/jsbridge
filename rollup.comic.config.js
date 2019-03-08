import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
	input: 'src/comic/comic.js',
	name: 'Bridge.comic',
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
		{ file: 'dist/bridge.comic.es.js', format: 'es' },
		{ file: 'dist/bridge.comic.iife.js', format: 'iife' }
	]
};