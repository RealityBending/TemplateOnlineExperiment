//upload data
//authenticate with octokit

import { Octokit } from "https://cdn.skypack.dev/@octokit/rest";

exports.handler = async (event, context) => {
    const octokit = new Octokit({
        auth: process.env.GH_OAUTH, // authenticating Octokit
    })
    const { data } = await octokit.request("/user");
    return {
        statusCode: 200,
        body: JSON.stringify({
            result: "ok"
        }),
    }
}
