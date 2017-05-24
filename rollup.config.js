import buble from 'rollup-plugin-buble';
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from "rollup-plugin-replace"
import alias from "rollup-plugin-alias"

export default {
  entry: 'src/index.js',
  dest: 'script.js',
  plugins: [
    alias({
      "react-router": require.resolve("react-router"),
      "react-color": require.resolve("react-color"),
      "reactcss": require.resolve("reactcss"),
      'react': require.resolve('preact-compat'),
      'react-dom': require.resolve('preact-compat'),
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    nodeResolve({
      browser: true,  // Default: false,
    }),
    commonjs({
      namedExports: {
        "node_modules/preact/dist/preact.js": ["h", "cloneElement", "Component", "render", "renderer", "options"]
      }
    }),
    buble({
      jsx: "h",
      objectAssign: "Object.assign"
    })
  ],
};
