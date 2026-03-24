import { redis } from "@/db/redisClient";

export async function GET(req, { params }) {
  /* const body = req.body;
    const data = await body.json();
    console.log(data) */
  //sleep 2000
  /* await new Promise((res, rej) => {
    setTimeout(() => {
      return res("ok");
    }, 4000);
  }); */
  const { email } = await params;
  let result;
  if (email) {
    result = await redis.get(email);
  }
  const status = await redis.keys("*");
  return Response.json(
    {
      message: "ok from test api",
      data: {
        status,
        result,
      },
    },
    {
      status: 288,
      statusText: "okeiut",
    },
  );
}
