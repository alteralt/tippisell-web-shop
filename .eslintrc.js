module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["airbnb-base", "plugin:vue/vue3-essential"],
    overrides: [
        {
            env: {
                node: true,
            },
            files: [".eslintrc.{js,cjs}"],
            parserOptions: {
                sourceType: "script",
            },
        },
    ],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["vue"],
    rules: {
        semi: [2, "never"],
        indent: ["error", 4],
        quotes: [2, "double", { avoidEscape: true }],
        "import/no-extraneous-dependencies": [
            "error",
            { devDependencies: true },
        ],
        "object-shorthand": 0,
        "import/prefer-default-export": ["off", "any"],
    },
}
