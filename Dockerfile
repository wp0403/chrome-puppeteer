# 使用 Node.js 官方镜像作为基础镜像
FROM buildkite/puppeteer:latest

# 设置工作目录
WORKDIR /app/chrome-puppeteer

# 复制 package.json 和 package-lock.json 文件
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 将项目文件复制到工作目录
COPY . .

# 暴露应用程序的端口
EXPOSE 7000

# 定义启动命令
CMD ["node", "index.js"]
