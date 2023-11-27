module.exports = {
    env: {
        browser: true,
        es2021: true,
        jquery: true,
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
        {
            files: ["src/views/**/*.vue"],
            rules: {
                "vue/multi-word-component-names": 0,
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
        "import/extensions": [
            "error",
            {
                js: "ignorePackages",
            },
        ],
        "operator-linebreak": 0,
    },
}
