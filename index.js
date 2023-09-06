const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const port = 3000;

// 创建一个 Map 结构存储 cookie 和过期时间
const cookieMap = new Map();

app.get("/", async (req, res) => {
  try {
    const url = req.query.url;

    if(!url){
      res.send('url为必选');
      return;
    }

    // 启动 Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();

    const domain = new URL(url).hostname;

    // 根据网站域名获取已存储的 cookie
    const matchingCookies = Array.from(cookieMap.entries()).filter(
      ([name, { domain: cookieDomain, expiresAt }]) =>
        cookieDomain === domain && Date.now() < expiresAt
    );

    if (matchingCookies.length > 0) {
      // 如果有匹配的 cookie，使用第一个 cookie 访问网站，并设置到新页面中
      const selectedCookie = matchingCookies[0];
      await page.setCookie({
        name: selectedCookie[0],
        value: selectedCookie[1].value,
        domain: domain,
      });
      await page.goto(url, { timeout: 30000 });
    } else {
      // 否则直接访问网站，获取 cookie，保存到 Map 结构中，并设置到新页面中
      await page.goto(url, { timeout: 30000 });
      const cookies = await page.cookies();
      cookies.forEach((cookie) => {
        const expirationTime = Date.now() + 5 * 60 * 1000; // 设置过期时间为 5 分钟
        cookieMap.set(cookie.name, {
          value: cookie.value,
          domain: cookie.domain,
          expiresAt: expirationTime,
        });
      });
      await page.setCookie(...cookies);
    }

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
