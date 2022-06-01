const restrictedGlobals = require('confusing-browser-globals');

module.exports = {
    rules: {
        //> javascript
        'max-classes-per-file': 'off',
        'import/no-cycle': 'off',
        'import/named': 'off',
        'import/prefer-default-export': 'off',
        'prefer-arrow-callback': 'off',
        'func-names': 'off',
        'no-param-reassign': 'off',
        'class-methods-use-this': 'off',
        'linebreak-style': 'off',
        'no-restricted-syntax': [
            // https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js
            'error',
            {
                selector: 'ForInStatement',
                message:
                    'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
            },
            {
                selector: 'LabeledStatement',
                message:
                    'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
            },
            {
                selector: 'WithStatement',
                message:
                    '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
            },
        ],
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
            },
        ],
        camelcase: 'off',
        quotes: [2, 'single', { avoidEscape: true }],
        'max-len': [
            'error',
            100,
            2,
            {
                ignoreUrls: true,
                ignoreComments: true,
                ignoreRegExpLiterals: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
            },
        ],
        'max-depth': ['error', 4],
        'max-nested-callbacks': ['error', 8],
        'no-negated-condition': 'error',
        'object-curly-newline': ['error', { consistent: true }],
        'padding-line-between-statements': [
            'error',
            {
                blankLine: 'always',
                prev: '*',
                next: 'return',
            },
        ],
        curly: ['error', 'all'],
        'spaced-comment': [
            'error',
            'always',
            {
                line: {
                    markers: ['>', '<'],
                },
                block: {
                    markers: ['*'],
                    balanced: true,
                },
            },
        ],
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: ['webpack.config.js', 'webpack.dev.js', 'webpack.prod.js'],
            },
        ],
        'no-restricted-globals': [
            'error',
            {
                name: 'isFinite',
                message:
                    'Use Number.isFinite instead https://github.com/airbnb/javascript#standard-library--isfinite',
            },
            {
                name: 'isNaN',
                message:
                    'Use Number.isNaN instead https://github.com/airbnb/javascript#standard-library--isnan',
            },
        ].concat(restrictedGlobals.filter((restricted_global) => restricted_global !== 'self')),
        //< javascript
        //> react
        'react/prefer-stateless-function': 'off',
        'react/prop-types': 'off',
        'react/no-array-index-key': 'off',
        'react/jsx-props-no-spreading': 'off',
        'jsx-quotes': ['error', 'prefer-single'],
        'jsx-a11y/label-has-associated-control': [
            2,
            {
                assert: 'either',
            },
        ],
        'react/function-component-definition': [
            'error',
            {
                namedComponents: 'arrow-function',
                unnamedComponents: 'arrow-function',
            },
        ],
        //< react
    },

    globals: {
        err: false,
        t: false,
        er_obj: false,
        l: false,
        user_language: false,
        app_version: false,
        app_root: false,
        s: false,
        sa: false,
        sb: false,
        sab: false,
    },

    settings: {
        'import/resolver': {
            node: {
                paths: ['src', 'src/js'],
                extensions: ['.js', '.jsx', '.css', '.svg', '.png', '.gif'],
            },
        },
    },

    env: {
        browser: true,
        node: true,
    },

    extends: ['airbnb', 'airbnb/hooks', 'prettier'],
    plugins: ['react', 'prettier'],
    parser: '@babel/eslint-parser',
};
