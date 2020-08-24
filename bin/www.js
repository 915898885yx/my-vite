#! /usr/bin/env node
// 在当前文件执行node脚本

// 通过http去启动一个模块，内部基于koa
// 
// 创建一个服务

const createServer = require("../index")
createServer().listen(4000, () => {
	console.log('server start 4000')
})