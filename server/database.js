const { Sequelize, DataTypes } = require('sequelize');
const config = require('../utils/config');

var sequelize = new Sequelize(
    config.db.database,
    config.db.username,
    config.db.password,
    {
        host: config.db.host,
        dialect: "mysql",
        timezone: "+08:00",
        logging: false,
    }
)

//创建模型
var Image = sequelize.define('image', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    url: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.TINYINT,
    },
    title: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    },
    sort_index: {
        type: DataTypes.INTEGER,
    }
},
    {
        timestamps: false
    }
);

// 测试与数据库连接是否成功
// try {
//     sequelize.authenticate();
//     console.log(' successfully.');
//   } catch (error) {
//     console.error( error);
//   }

//log images table
(async () => {
    // 这里是代码
    await sequelize.sync({ alter: true });
    // const item = await Image.findAll();
    // for (let i of item) {
    //     console.log(JSON.stringify(i))
    // }
})();

module.exports = Image;
