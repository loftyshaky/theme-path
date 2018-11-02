module.exports = {
    rules: {
        'camelcase': 0,
        'import/no-extraneous-dependencies': 0,
        'padded-blocks': 0,
        'spaced-comment': 0,
        'no-plusplus': 0,
        'import/prefer-default-export': 0,
        'no-alert': 0,
        'react/jsx-pascal-case': 0,
        'react/prop-types': 0,
        'jsx-a11y/label-has-associated-control': 0,
        'jsx-a11y/label-has-for': 0,
        'react/jsx-one-expression-per-line': 0,
        'jsx-a11y/anchor-is-valid': ['error',
            {
                'components': ['Link']
            },
        ],
        'indent': [
            'error',
            4,
        ],
        'react/jsx-indent': [
            'error',
            4,
        ],
        'react/jsx-indent-props': [
            'error',
            4,
        ],
        'linebreak-style': [
            'error',
            'windows',
        ],
        'no-use-before-define': [
            'error',
            {
                'variables': false,
            },
        ],
        'max-len': [
            'error',
            {
                'code': 120,
                'ignoreComments': true,
                'ignoreTrailingComments': true
            },
        ],
        'arrow-parens': [
            'error',
            'as-needed',
        ],
        'radix': [
            'error',
            'as-needed',
        ],
        'no-console': ['error',
            {
                allow: ['error'],
            },
        ],
        'no-underscore-dangle': [
            'error',
            {
                'allow':
                    ['__'],
            },
        ],
    },

    globals: {
        'l': false,
        's': false,
        'sa': false,
        'sb': false,
        'sab': false,
    },

    settings: {
        'import/resolver':
        {
            'node':
            {
                'paths': [
                    'src',
                    'src/js',
                ],
                'extensions': [
                    '.js',
                    '.jsx',
                    '.css',
                    '.svg',
                    '.png',
                    '.gif',
                ],
            },
        },
    },

    'env': {
        'browser': true,
        'node': true
    },

    'parser': 'babel-eslint',
    'extends': 'airbnb',
    'plugins': [
        'react',
        'jsx-a11y',
        'import'
    ],
};