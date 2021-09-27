# gatsby-plugin-dataunlocker

DataUnlocker integration with Gatsby-powered websites.

- Injects DataUnlocker's script to all website's pages using the
  [dynamic script injection](https://dataunlocker.com/docs/install/script/dynamic/)
  provided by DataUnlocker.

## Usage

In your `gatsby-config.js`, use the following:

```javascript
module.exports = {
  plugins: [
    'other-plugin1',
    'other-plugin2',
    {
      // Keep gatsby-plugin-dataunlocker below all other plugins, as it is a post-processing plugin.
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
