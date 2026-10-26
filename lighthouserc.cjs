module.exports = {
  ci: {
    collect: {
      staticDistDir: "./_site",
      numberOfRuns: 1,
      settings: {
        onlyCategories: ["accessibility", "best-practices", "performance"],
        chromeFlags: "--no-sandbox --disable-dev-shm-usage",
      },
    },
    assert: {
      assertions: {
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:performance": ["warn", { minScore: 0.7 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
