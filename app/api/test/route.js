export async function POST(req){
    const body = req.body;
    const data = await body.json();
    console.log(data)
    return Response.json({
        message: 'ok from test api'
    }, {
        status: 288,
        statusText: 'okeiut'
    })
}