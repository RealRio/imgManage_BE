// add item   item.destory() to delete item
const Image = require('../database')

async function add(url,status){
    const item = await Image.create({
        id:0,
        url,
        status,
    })
    await item.save();
};
module.exports=add;
