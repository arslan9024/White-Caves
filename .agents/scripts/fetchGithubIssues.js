// fetchGithubIssues.js
// Script to retrieve open GitHub issues for the repo and store them in crucible-state.json (overwrites dummy data)
// Requires GITHUB_TOKEN env var with repo access.
const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

async function fetchIssues() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('GITHUB_TOKEN not set. Exiting.');
    process.exit(1);
  }
  const octokit = new Octokit({ auth: token });
  const owner = 'your-org-or-user'; // TODO: replace with actual owner
  const repo = 'your-repo'; // TODO: replace with actual repo name
  try {
    const { data } = await octokit.issues.listForRepo({ owner, repo, state: 'open' });
    const issues = data.map(i => ({ number: i.number, title: i.title, url: i.html_url }));
    const cruciblePath = path.resolve(__dirname, '..', 'crucible-state.json');
    const state = {
      Phase: 2,
      OpenIssues: issues.map(i => i.number.toString()),
      IssuesDetail: issues,
      LastRun: new Date().toISOString()
    };
    fs.writeFileSync(cruciblePath, JSON.stringify(state, null, 2));
    console.log(`Fetched ${issues.length} open issues and wrote to crucible-state.json`);
  } catch (err) {
    console.error('Error fetching issues:', err);
    process.exit(1);
  }
}

fetchIssues();

