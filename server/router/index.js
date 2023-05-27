const Router = require('koa-router')();
const Image = require('../database')
const { Op } = require("sequelize");

Router.post('/getImages', async ctx => {
    // 查询所有用户
    const { lastIndex } = ctx.request.body;
    const pageSize = ctx.request.body?.pageSize || 9999;
    const images = await Image.findAll({
        order: [['sort_index', 'ASC']],
        where: {
            sort_index: {
                [Op.gt]: lastIndex // 使用 Sequelize.Op.gt 来表示大于操作符
            }
        },
        limit: pageSize // 限制查询结果返回的记录数为 20 条
    })
        .catch(error => {
            console.error(error); // 处理查询过程中的错误
        });
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
    console.log(ctx.request.body.id + 'router_index');
    const minIndexResult = await Image.findOne({
        order: [['sort_index', 'ASC']]
    });
    await Image.update({ sort_index: minIndexResult.sort_index - 1 }, {
        where: { id: ctx.request.body.id }
    });
    const item = await Image.findAll();
    for (let i of item) {
        console.log(JSON.stringify(i))
    }
    ctx.response.body = {
    }
})
Router.post('/changeOrder', async (ctx, next) => {
    console.log(ctx.request.body.id + ctx.request.body.newIndex);
    await Image.update({ sort_index: ctx.request.body.newIndex }, {
        where: { id: ctx.request.body.id }
    });
    const item = await Image.findAll();
    for (let i of item) {
        console.log(JSON.stringify(i))
    }
    ctx.response.body = {
    }
})

Router.post('/uploadImage', async (ctx, next) => {
    if (Array.isArray(ctx.request.files.images)) {
        const maxSortIndex = await Image.max('sort_index');
        var { title, description } = ctx.request.body;
        title = title[0], description = description[0];
        var times = 1;
        for (const item of ctx.request.files.images) {
            const filename = item.newFilename;
            await Image.create({
                title,
                description,
                status: 0,
                url: `http://127.0.0.1:3001/upload/${filename}`,
                sort_index: maxSortIndex ? maxSortIndex + 100 * times : 100 * times,
            });
            times++;
        }
    }
    else {
        const filename = ctx.request.files.images.newFilename;
        const { title, description } = ctx.request.body;
        const maxSortIndex = await Image.max('sort_index');
        console.log(title, description, filename, maxSortIndex);
        await Image.create({
            title,
            description,
            status: 0,
            url: `http://127.0.0.1:3001/upload/${filename}`,
            sort_index: maxSortIndex ? maxSortIndex + 100 : 100,
        });
    }
    ctx.response.body = {
        "status": 'success',
    }
})
module.exports = Router