const {readBody} = require("./utils")
const {parse} = require('es-module-lexer') // 解析语法树 import语法
const MagicString = require('magic-string') // 重写字符串
function rewriteImports (source) {
	let imports = parse(source)[0] // 静态import 0  动态 1
	let magicString = new MagicString(source)
	if (imports.length) { // 对import进行拦截
		// 说明有多条import语法
		for (let i = 0; i < imports.length; i++) {
			let {s, e} = imports[i]
			let id = source.substring(s, e); // vue   ./App
      // 当前开头使 /   .不小红鞋
			if (/^[^\/\.]/.test(id)) {// 当前的开头不是/ 不是.
        id = `/@modules/${id}`
        magicString.overwrite(s, e, id)
			}
		}
  }
  return magicString.toString(); 
  // 替换后的结果返回 增加@module 浏览器会重新发送请求，拦截处理带有/@modules前缀的请求，进行处理
}

function moduleRewritePlugin ({app, root}) {
	app.use(async (ctx, next) => {
		await next()
		// 获取流中的数据

		if (ctx.body && ctx.response.is('js')) { // 只处理流和js文件
			let content = await readBody(ctx.body)
			// 重写结果，讲内容返回
			const result = rewriteImports(content)
			ctx.body = result
		}
	})
}

exports.moduleRewritePlugin = moduleRewritePlugin