"use strict";
const fs = require("fs");
const Hapi = require("@hapi/hapi");
const path = require("path");
const multer = require("multer");
const { handler } = require("@hapi/hapi/lib/cors");
// const GetProduct = require("./query/product");
const Connection = require("./dbconfig");
const { getProduct, createProduct, deleteProduct } = require("./query/product");

const upload = multer({ dest: "uploads/" });
const init = async () => {
    const server = Hapi.Server({
        host: "localhost",
        port: 1234,
    });

    await server.register([
        {
            plugin: require("hapi-geo-locate"),
            options: {
                enabledByDefault: false,
            },
        },
        {
            plugin: require("@hapi/inert"),
        },
    ]);
    server.route([
        {
            method: "GET",
            path: "/product",
            config: {
                cors: true,
            },
            handler: async (req, h) => {
                const product = await getProduct();
                // console.log("p", product);
                // return "hi";
                return product;
            },
        },
        {
            method: "POST",
            path: "/create-product",
            options: {
                payload: {
                    output: "stream",
                    parse: true,
                    allow: "multipart/form-data",
                    multipart: true, // <== this is important in hapi 19
                },
            },
            handler: async (req, h) => {
                // upload.single("productImage");
                // console.log("file", req.payload.image);
                // console.log("req", req.payload);
                const data = req.payload;
                if (data.image) {
                    const imagename = data.image.hapi.filename;
                    const path = __dirname + "/uploads/" + imagename;
                    const file = fs.createWriteStream(path);

                    file.on("error", (err) => console.error(err));

                    data.image.pipe(file);

                    data.image.on("end", (err) => {
                        const ret = {
                            filename: data.image.hapi.filename,
                            headers: data.image.hapi.headers,
                        };
                        return JSON.stringify(ret);
                    });
                    await createProduct(req.payload, imagename);
                }
                return "success";
            },
        },
        {
            method: "DELETE",
            path: "/delete-product/{id}",
            handler: async (req, h) => {
                console.log(parseInt(req.params.id));
                const res = await deleteProduct(parseInt(req.params.id));
                return res;
            },
        },
        // {
        //     //params
        //     method: "GET",
        //     path: "/user/{name}",
        //     handler: (request, h) => {
        //         return `<h1>Hai ${request.params.name}</h1>`;
        //     },
        // },
        // {
        //     //query params
        //     method: "GET",
        //     path: "/users/{user?}",
        //     handler: (request, h) => {
        //         return `<h1>${request.query.name} ${request.query.last_name}</h1>`;
        //     },
        // },
    ]);

    await server.start();
    console.log(`Server start on : ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
    console.log(err);
    process.exit(1);
});

init();
