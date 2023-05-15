const Router = require('koa-router')();
const Image = require('../database')

Router.get('/getImages', async ctx => {
    // 查询所有用户
    const images = await Image.findAll();
    ctx.body = images;
    return ctx;
})
Router.post('/passImage', async (ctx, next) => {
    console.log(ctx.request.body.id + 'router_index');
    await Image.update({ status: 1 }, {
        where: { id: ctx.request.body.id }
    });
    const item = await Image.findAll();
    for (let i of item) {
        console.log(JSON.stringify(i))
    }
    ctx.response.body = {
    }
})
Router.post('/refuseImage', async (ctx, next) => {
    console.log(ctx.request.body.id + 'router_index');
    await Image.update({ status: 2 }, {
        where: { id: ctx.request.body.id }
    });
    const item = await Image.findAll();
    for (let i of item) {
        console.log(JSON.stringify(i))
    }
    ctx.response.body = {
    }
})
Router.post('/deleteImage', async (ctx, next) => {
    console.log(ctx.request.body.id + 'router_index');
    await Image.destroy({
        where: { id: ctx.request.body.id }
    });
    const item = await Image.findAll();
    for (let i of item) {
        console.log(JSON.stringify(i))
    }
    ctx.response.body = {
    }
})

Router.post('/setTop', async (ctx, next) => {
    // console.log(ctx.request.body.id + 'router_index');
    // await Image.destroy({
    //     where:{id:ctx.request.body.id}
    // });
    // const item = await Image.findAll();
    // for (let i of item) {
    //     console.log(JSON.stringify(i))
    // }
    // ctx.response.body = {
    // }
})

Router.post('/uploadImage', async (ctx, next) => {
    console.log(ctx.request.files.images, Array.isArray(ctx.request.files.images))
    if (Array.isArray(ctx.request.files.images)) {
        for (const item of ctx.request.files.images) {
            const filename = item.newFilename;
            var { title, description } = ctx.request.body;
            title = title[0], description = description[0];
            await Image.create({
                title,
                description,
                status:0,
                url: `http://127.0.0.1:3001/upload/${filename}`
            });
        }
    }
    else {
        const filename = ctx.request.files.images.newFilename;
        const { title, description } = ctx.request.body;
        console.log(title, description)
        await Image.create({
            title,
            description,
            status:0,
            url: `http://127.0.0.1:3001/upload/${filename}`
        });
    }
    // }
    // else {
    //     for (let i = 0; i < title.length; i++)
    //         await Image.create({

    //         });
    // }
    const item = await Image.findAll();
    for (let i of item) {
        console.log(JSON.stringify(i))
    }
    ctx.response.body = {
        "status": 'success',
    }
})
module.exports = Router