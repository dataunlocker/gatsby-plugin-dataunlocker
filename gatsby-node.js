const glob = require(`tiny-glob`);
const fs = require(`fs-extra`);
const { createReadStream, readFile } = require(`fs`);
const fetch = require(`node-fetch`);

const BATCH_RUN_ID = Math.random().toString(36).slice(2);
const BATCH_MAX_RPS = 6;
const BATCH_MAX_PARALLEL_API_REQUESTS = 3;
const DATAUNLOCKER_ENDPOINT = ({ propertyId, scriptVersion }) =>
  `https://api.dataunlocker.com/properties/${propertyId}/scripts/${scriptVersion}/inject?batchRunId=${encodeURIComponent(
    BATCH_RUN_ID
  )}`;

// Ensure that this plugin gets correct options.
exports.pluginOptionsSchema = ({ Joi }) => {
  return Joi.object({
    propertyId: Joi.string()
      .pattern(/^[a-zA-Z0-9]{24}$/)
      .required(),
    scriptVersion: Joi.string().pattern(
      /^latest|(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
    ),
  });
};

const processHtmlFile = async (filePath, { propertyId, scriptVersion }) => {
  let apiResult;
  let processedBody = '';

  const fileContents = await fs.readFile(filePath);
  if (!/<head>/i.test(fileContents)) {
    console.log(
      `DataUnlocker: skipping ${filePath} as it doesn't look like valid HTML.`
    );
    return;
  }

  try {
    console.log(`DataUnlocker: patching ${filePath}`);
    apiResult = await fetch(
      DATAUNLOCKER_ENDPOINT({ propertyId, scriptVersion }),
      {
        method: 'post',
        headers: {
          'Content-Type': 'text/html',
        },
        body: createReadStream(filePath),
      }
    );
  } catch (e) {
    console.error(
      `DataUnlocker: unable to patch ${filePath}. DataUnlocker's API endpoint errors when processing: ${e}`
    );
    return;
  }

  try {
    processedBody = await apiResult.text();
  } catch (e) {
    /* Keep processedBody empty, as the status should not be 200. */
  }

  if (apiResult.status !== 200) {
    console.error(
      `DataUnlocker: unable to patch ${filePath}. DataUnlocker's API endpoint returned status ${apiResult.status}: ${processedBody}`
    );
    return;
  }

  return await fs.writeFile(filePath, processedBody);
};

exports.onPostBuild = async (
  _,
  { propertyId = '', scriptVersion = 'latest' }
) => {
  const files = await glob(`public/**/*.html`, {
    filesOnly: true,
  });
  const promises = files.map((fileName) => async () => {
    const start = Date.now();
    await processHtmlFile(fileName, { propertyId, scriptVersion });
    const extra =
      (1000 / BATCH_MAX_RPS) * BATCH_MAX_PARALLEL_API_REQUESTS -
      (Date.now() - start);
    if (extra > 0) {
      await new Promise((r) => setTimeout(r, extra));
    }
  });

  // Run tasks in parallel with the max concurrency limited to BATCH_MAX_PARALLEL_API_REQUESTS.
  const workers = new Array(BATCH_MAX_PARALLEL_API_REQUESTS)
    .fill(promises.entries())
    .map(async (iterator) => {
      for (let [_, f] of iterator) {
        await f();
      }
    });
  await Promise.allSettled(workers);
};
