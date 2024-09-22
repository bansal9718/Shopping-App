const apiUsage = {};

const apiTracker = (req, res, next) => {
  const endpoint = req.url;

  if (!apiUsage[endpoint]) {
    apiUsage[endpoint] = 0;
  }

  apiUsage[endpoint]++;
  console.log(`API usage for ${endpoint}: ${apiUsage[endpoint]} times`);
  next(); // Pass control to the next middleware
};

module.exports = apiTracker;
