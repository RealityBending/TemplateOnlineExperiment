# Template for JsPsych Experiments

I'm trying out JsPsych, and this repo is mostly for me for later reuse.

## How to Push Results to Repo

1. Create Netlify account and sync with the GitHub repository to be deployed
2. Go to **Deploy Settings > Functions > Settings > Functions directory** and add directory where functions will be stored i.e., `.netlify/functions/api`
3. Go to **GitHub settings** (under your own profile) > **Developer settings > Personal access tokens** and generate a new token.
4. Go to **Environment** under the same netlify settings to add a `GH_TOKEN` environment variable, which is the value of the personal access token

