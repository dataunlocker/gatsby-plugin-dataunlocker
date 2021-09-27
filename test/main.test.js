import test from 'ava';
import { promises as fsPromises } from 'fs';
import glob from 'tiny-glob';

test("injects DataUnlocker's script on each Gatsby's page", async (t) => {
  const files = await glob(
    `${__dirname}/test-gatsby-website/public/**/*.html`,
    {
      filesOnly: true,
    }
  );

  const fileContents = await Promise.all(files.map(
    (f) => fsPromises.readFile(f).then(f => f.toString())));

  for (const content of fileContents) {
    t[content.includes('<head') ? 'regex' : 'notRegex'](content, /<script>Function\(/);
  }
});
