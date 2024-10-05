import path from "node:path";
import { createCanvas, loadImage } from "canvas";
import type { Image } from "canvas";
import sharp from "sharp";
import { generate } from "text-to-image";

async function generateImg() {
  const artImg = sharp(path.join(__dirname, "./assets/base/water.png")).resize(1920, 1080);

  const characterImg = await loadImage(path.join(__dirname, "./assets/spla/furina.png"));
  const characterAlphaImg = await createAlpha(characterImg);
  const characterAlphaImgResized = await sharp(characterAlphaImg).resize(715, 640).toBuffer();

  const con = await sharp(path.join(__dirname, "./assets/const/water.png"))
    .resize(90, 90)
    .toBuffer();

  const nameImg = await createName("フリーナ");
  const lvImg = await createLV(90);

  const love = await sharp({
    create: {
      width: 68,
      height: 56,
      channels: 3,
      background: { r: 0, g: 0, b: 0 },
    },
  })
    .png()
    .composite([
      {
        input: path.join(__dirname, "./assets/love.png"),
      },
    ])
    .toBuffer();

  artImg.composite([
    {
      input: characterAlphaImgResized,
      left: 0,
      top: 0,
    },
    {
      input: con,
      left: 665,
      top: 90,
    },
    {
      input: con,
      left: 665,
      top: 180,
    },
    {
      input: con,
      left: 665,
      top: 270,
    },
    {
      input: con,
      left: 665,
      top: 360,
    },
    {
      input: con,
      left: 665,
      top: 450,
    },
    {
      input: con,
      left: 665,
      top: 540,
    },
    {
      input: nameImg,
      left: 30,
      top: 40,
    },
    {
      input: lvImg,
      left: 30,
      top: 70,
    },
  ]);

  const artImgBuffer = await artImg.toBuffer();

  return `data:image/png;base64,${artImgBuffer.toString("base64")}`;
  /*
  const canvas = createCanvas(1920, 1080);
  const ctx = canvas.getContext("2d");

  // 背景描画
  const backgroundImg = await loadImage(path.resolve("./src/assets/base/water.png"));
  ctx.drawImage(backgroundImg, 0, 0);

  // キャラクター描画
  const characterImg = await loadImage(path.resolve("./src/assets/spla/furina.png"));
  const characterAlphaImg = await createAlpha(characterImg);
  ctx.drawImage(characterAlphaImg, 0, 50, 760, 680, 0, 15, 760, 670);
  ctx.globalCompositeOperation = "normal";

  // 凸を描画
  const con = await loadImage(path.resolve("./src/assets/const/water.png"));
  ctx.drawImage(con, 665, 90, 90, 90);
  ctx.drawImage(con, 665, 180, 90, 90);
  ctx.drawImage(con, 665, 270, 90, 90);
  ctx.drawImage(con, 665, 360, 90, 90);
  ctx.drawImage(con, 665, 450, 90, 90);
  ctx.drawImage(con, 665, 540, 90, 90);

  // 名前描画
  ctx.font = "48px 'SDK_JP_Web'";
  ctx.fillStyle = "white";
  ctx.fillText("フリーナ", 30, 80);

  return canvas.toDataURL("image/png");
  */
}

async function createAlpha(characterImg: Image) {
  const canvas = createCanvas(760, 680);
  const ctx = canvas.getContext("2d");

  const gradientX = ctx.createLinearGradient(0, 0, canvas.width, 0);
  gradientX.addColorStop(0, "rgba(0, 0, 0, 0)");
  gradientX.addColorStop(0.2, "rgba(0, 0, 0, 0.8)");
  gradientX.addColorStop(0.5, "rgba(0, 0, 0, 1)");
  gradientX.addColorStop(0.8, "rgba(0, 0, 0, 0.8)");
  gradientX.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = gradientX;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "source-in";
  ctx.drawImage(characterImg, 400, 0, 1200, 1024, 0, 0, 780, 680);
  ctx.globalCompositeOperation = "normal";

  return canvas.toBuffer();
}

async function createName(characterName: string) {
  const data = await generate(`${characterName}`, {
    fontPath: path.join(__dirname, "./assets/font/ja-jp.ttf"),
    fontSize: 48,
    textColor: "white",
    bgColor: "rgba(0, 0, 0, 0)"
  });
  const dataBase64 = data.split(',')[1];
  const buffer = Buffer.from(dataBase64, "base64");
  return buffer;
}

async function createLV(lv: number) {
  const data = await generate(`${lv}`, {
    fontPath: path.join(__dirname, "./assets/font/ja-jp.ttf"),
    fontSize: 25,
    textColor: "white",
    bgColor: "rgba(0, 0, 0, 0)"
  });
  const dataBase64 = data.split(',')[1];
  const buffer = Buffer.from(dataBase64, "base64");
  return buffer;
}

export default generateImg;
