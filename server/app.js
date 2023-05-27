const Koa = require('koa');
const fs = require('fs');
const path = require('path')
const Router = require('./router')
const { koaBody } = require('koa-body')
const static = require('koa-static')
const app = new Koa();

app.use(async (ctx, next) => {
    console.log(`${ctx.request.method}+${ctx.request.url}`);
    await next();
})
app.use(async (ctx, next) => {
    // 获取请求路径
    const requestPath = ctx.request.path;
    console.log(requestPath)
    // 前端支持上传image/png, image/jpeg, image/jpg, image/gif
    if (/\.(png|jpeg|jpg|gif)$/.test(requestPath)) {
        // 设置 Cache-Control 头字段
        ctx.set('Cache-Control', 'max-age=300');
    }
    await next();
});
app.use(koaBody({
    multipart: true, // 支持文件上传
    formidable: {
        uploadDir: path.join(__dirname, './public/upload'), // 设置文件上传目录
        keepExtensions: true,    // 保持文件的后缀
        includeUnparsed: true,
        onFileBegin: (name, file) => {
            // console.log(`name: ${name}`);
            // console.log(file);
        },
    },
    onError: (err, ctx) => {
        console.error(err);
        ctx.throw(400, '解析请求体失败');
    },
    json: true,

}))
app.use(static(path.join(__dirname, 'public')
    // index: false,    // 默认为true  访问的文件为index.html  可以修改为别的文件名或者false
    // hidden: false,   // 是否同意传输隐藏文件
    // defer: true
));

app.use(Router.routes());
app.listen(3001);

console.log('app start at 3001');