const sequelize = require("../dbconfig/index");

module.exports.getProduct = async function () {
    try {
        await sequelize.authenticate();
        const [res, metadata] = await sequelize.query("select * from product");
        // console.log("res", res);
        return res;
        // console.log("metadata", metadata);
    } catch (error) {
        console.log(error);
    }
};

module.exports.createProduct = async function (props, imagename) {
    const { name, stock, sku, description, price } = props;
    console.log("props", name, stock, sku, description, price);
    await sequelize.authenticate();
    const [res, , metadata] = await sequelize.query(
        `insert into product (name, stock, sku, image, description, price ) values('${name}', ${stock},'${sku}','${imagename}','${description}',${price} )`
    );
    return res;
};

module.exports.deleteProduct = async function (id) {
    console.log("id", id);
    await sequelize.authenticate();
    const [res, metadata] = await sequelize.query(
        `delete from product where id = ${id}`
    );

    return res;
};
