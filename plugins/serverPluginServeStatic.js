const static = require('koa-static')
const path = require('path')
function serveStaticPlugin ({app, root}) {
	// vite在哪运行就以哪个目录作为静态目录
	app.use(static(root))
	app.use(static(path.join(root, "public")))
}



// 解构导出静态服务插件
exports.serveStaticPlugin = serveStaticPlugin