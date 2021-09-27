module.exports = {
  siteMetadata: {
    siteUrl: "https://public-test.dataunlocker.com",
    title: "Test Gatsby Website",
  },
  plugins: [
    'gatsby-plugin-meta-redirect',
    {
      resolve: require.resolve(`../..`),
      options: {
        propertyId: "534c5239534d2d687a744b38",
        scriptVersion: "latest",
      },
    },
  ],
};
