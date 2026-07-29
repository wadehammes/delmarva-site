export default {
  extends: ["stylelint-config-standard", "stylelint-config-css-modules"],
  overrides: [
    {
      files: ["src/styles/performance.css"],
      rules: {
        "property-no-vendor-prefix": null,
      },
    },
  ],
  plugins: ["stylelint-value-no-unknown-custom-properties"],
  rules: {
    "block-no-empty": true,
    "csstools/value-no-unknown-custom-properties": [
      true,
      {
        importFrom: ["src/styles/variables.css"],
      },
    ],
    "keyframes-name-pattern": null,
    "selector-class-pattern": null,
    "value-keyword-case": [
      "lower",
      {
        camelCaseSvgKeywords: true,
        ignoreKeywords: [
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "stolzl",
          "europa",
          "regulator-nova",
        ],
      },
    ],
  },
};
