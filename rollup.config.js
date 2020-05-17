import resolve from '@rollup/plugin-node-resolve';
import nodeBuiltins from 'builtin-modules';

export default {
    input: 'dist/main.js',
    plugins: [resolve()],
    external: [...nodeBuiltins, 'vscode'],
    output: {
        file: './dist/main.js',
        format: 'cjs',
        exports: 'named',
    }
}
