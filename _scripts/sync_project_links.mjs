import { writeFile } from 'node:fs/promises';

const projects = {
  david: 'isaachuahy/david',
  'ml-monitor': 'isaachuahy/ml-monitor',
};
const linkFields = ['demo_url', 'deployment_url'];

async function readProjectLinks(repo) {
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/contents/portfolio.json`, {
      headers: { Accept: 'application/vnd.github.raw+json' },
      signal: AbortSignal.timeout(5000),
    });
    if (response.status === 404) return {};
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const manifest = await response.json();
    const links = {};
    for (const field of linkFields) {
      const value = manifest?.[field];
      if (value === undefined) continue;

      const url = typeof value === 'string' ? URL.parse(value) : null;
      if (url?.protocol !== 'https:' || url.username || url.password) {
        console.warn(`Ignoring invalid ${field} in ${repo}/portfolio.json`);
        continue;
      }
      links[field] = url.href;
    }
    return links;
  } catch (error) {
    console.warn(`Using fallback links for ${repo}: ${error.message}`);
    return {};
  }
}

const results = await Promise.all(Object.entries(projects).map(async ([slug, repo]) => {
  return [slug, await readProjectLinks(repo)];
}));

await writeFile(
  new URL('../_data/project_links.json', import.meta.url),
  JSON.stringify(Object.fromEntries(results), null, 2) + '\n',
);
