const RULES = {
    OFF: 'off',
    WARN: 'warn',
    ERROR: 'error',
};

module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: ['airbnb-base', 'prettier'],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        'no-unused-vars': RULES.WARN,
        'no-unused-expressions': RULES.OFF,
        'class-methods-use-this': RULES.OFF,
        'no-console': RULES.OFF,
    },
};
