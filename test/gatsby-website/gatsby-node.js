exports.createPages = ({ actions }) => {
  const { createRedirect } = actions;

  createRedirect({
    fromPath: '/test-redirect/',
    toPath: '/test-page-redirect-to/',
    isPermanent: true,
  });
};
