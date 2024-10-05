import { serve } from "@hono/node-server";
import { Hono } from "hono";
import generateImg from "./functions";

const app = new Hono();

app.get("/", async (c) => {
  const startTime = performance.now();
  const imgData = await generateImg();
  const endTime = performance.now();
  const res = endTime - startTime;

  return c.render(
    <html>
      <img src={imgData} style='width: 80%; margin: 0 auto;' />
      <p>作成にかかった時間: {res}ミリ秒</p>
    </html>,
  );
});

const port = 3000;
console.log(`The server is running on port ${port}.`);

serve({
  fetch: app.fetch,
  port,
});
