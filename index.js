const Koa = require('koa')
const {serveStaticPlugin} = require("./plugins/serverPluginServeStatic")
const {moduleRewritePlugin} = require("./plugins/serverPluginModuleRewritePlugin")
const {moduleResolvePlugin} = require('./plugins/serverPluginModuleResolve')
function createServer () {
	const app = new Koa() // 创建koa实力
	const root = process.cwd() // 当前运行得工作目录
	// koa基于中间件运行
	
	const context = {
		app,
		root // 当前根位置
	}
	const resolvedPlugins = [ // 插件集合


		// 2.解析import 重写路径
		moduleRewritePlugin,
		// 3.解析以@modules文件开头的内容，找到对应的结果
		moduleResolvePlugin,
		// 1.实现静态服务的内容
		serveStaticPlugin
	]
	resolvedPlugins.forEach(plugin => plugin(context))
	return app //app中又listen方法
}
module.exports = createServer