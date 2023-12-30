# chrome-puppeteer
操作浏览器访问指定网站

docker build -t chrome-puppeteer:1.0.1 .

docker run -p 7002:7000 -d chrome-puppeteer:latest

docker push wp0403/chrome-puppeteer:1.0.1

docker pull wp0403/chrome-puppeteer:1.0.3