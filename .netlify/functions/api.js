exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            auth: process.env.GH_TOKEN
        }),
    }
}