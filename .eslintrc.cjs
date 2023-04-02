module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: [ '@typescript-eslint'],
    overrides: [
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: [
            './tsconfig.json',
            'vite.config.ts'
        ]
    },
    rules: {
        semi: ['error', 'never'],
        quotes: ['error', 'single'],
        indent: ['error', 4, { SwitchCase: 1 }],
        '@typescript-eslint/no-explicit-any': 'off',
        'no-control-regex': 0,
        'block-spacing': [2, 'always'],
        'keyword-spacing': [2, { before: true, after: true }],
        'no-multiple-empty-lines': [2, { max: 1 }],
        'space-before-blocks': [2, 'always'],
        'space-before-function-paren': [2, 'always'],
        'space-infix-ops': 2
    }
}
