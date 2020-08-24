const moduleREG = /^\/@modules\//
const fs = require('fs').promises
const path = require('path')
function resolveVue(root) {
  // vue3组成部分   runtime-dom runtime-core reactivity shared,在后端解析compiler-sfc
  
  
  // 编译在后端实现，所以需要拿到文件时commonjs规范
  const compilerPkgPath = path.join(root, 'node_modules', '@vue/compiler-sfc/package.json')
  const compilerPkg = require(compilerPkgPath) // 获取json内容

  const compilerPath = path.join(path.dirname(compilerPkgPath), compilerPkg.main)

  const resolvePath = (name) => path.resolve(root, 'node_modules', `@vue/${name}/dist/${name}.esm-bundler.js`)

  const runtimeDomPath = resolvePath('runtime-dom');
  const runtimeCorePath = resolvePath('runtime-core')
  const reactivityPath = resolvePath('reactivity')
  const sharedPath = resolvePath('sharedPath')
  // esmodule 模块
  return {
    compiler: compilerPath,
    '@vue/runtime-dom': runtimeDomPath,
    '@vue/runtime-core': runtimeCorePath,
    '@vue/reactivity': reactivityPath,
    '@vue/shared': sharedPath,
    vue:runtimeDomPath,
  }
}

function moduleResolvePlugin ({app, root}) {
  const vueResolved = resolveVue(root)// 根据当前运行vite目录解析运行文件表，包含vue的所有模块
  app.use(async (ctx, next) => {
    if (!moduleREG.test(ctx.path)) { // 处理当前请求路径是否以@modules开头
      return next() // 不是
    }
    // 将@modules替换掉 /@modules/vue
    const id = ctx.path.replace(moduleREG, ''); // vue


    ctx.type = 'js'; //设置响应类型未js类型
    // 应该取当前项目下查找vue对应的真实文件
    console.log(vueResolved[id], "vueResolved[id]")
    const content = await fs.readFile(vueResolved[id], 'utf-8')
    ctx.body = content
  })
}

exports.moduleResolvePlugin = moduleResolvePlugin