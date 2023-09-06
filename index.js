const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const port = 3000;

app.get("/", async (req, res) => {
  try {
    const url = req.query.url;

    // 启动 Puppeteer
    const browser = await puppeteer.launch({
        headless: true,
    });
    const page = await browser.newPage();

    // 访问指定的网站
    await page.goto(url, { timeout: 30000 });

    // 获取页面的 HTML 内容
    const pageContent = await page.content();

    // 关闭浏览器
    await browser.close();

    // 返回页面内容
    res.send(pageContent);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
