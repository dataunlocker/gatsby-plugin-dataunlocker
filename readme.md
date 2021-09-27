# gatsby-plugin-dataunlocker

[![Node.js package](https://github.com/dataunlocker/gatsby-plugin-dataunlocker/actions/workflows/build-and-push.yaml/badge.svg)](https://github.com/dataunlocker/gatsby-plugin-dataunlocker/actions/workflows/build-and-push.yaml)
[![Package version](https://img.shields.io/npm/l/gatsby-plugin-dataunlocker)](https://www.npmjs.com/package/gatsby-plugin-dataunlocker)

[DataUnlocker](https://dataunlocker.com) integration with Gatsby-powered websites.

- Injects DataUnlocker's script to all website's pages using the
  [dynamic script injection](https://dataunlocker.com/docs/install/script/dynamic/)
  provided by DataUnlocker.

This means each time your website is built, DataUnlocker's script is injected automatically.
You don't need to manually inject DataUnlocker's script, but you still need to create proxy
endpoints in [DataUnlocker Admin Console](https://admin.dataunlocker.com/).

## Usage

Add `gatsby-plugin-dataunlocker` to your project with:

```bash
npm install gatsby-plugin-dataunlocker
```

Now in your `gatsby-config.js`, use the following:

```javascript
module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-dataunlocker',
      options: {
        propertyId: '6751714b4c5980736a4b6aaa', // Required. Your DataUnlocker property ID.
        scriptVersion: 'latest', // Optional. Use 'latest' or a specific script version like '3.0.3'.
      },
    },
  ],
};
```

## License

[MIT](LICENSE) © [DataUnlocker](https://dataunlocker.com)
