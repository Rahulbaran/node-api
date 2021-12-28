"use strict";

import dotenv from "dotenv";
import http from "http";
import fs from "fs";
import url from "url";

//To laod all the environment variables
dotenv.config();

//Create Server
const server = http.createServer();

//Reading startups.json file
const startupsData = JSON.parse(
    fs.readFileSync(`./data/startups.json`, "utf-8")
);

//Routes
server.on("request", (req, res) => {
    const { pathname } = url.parse(req.url, true);

    //route to get all the startups data (GET METHOD)
    if (pathname === "/api/v1/startups" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({
                status: "success",
                results: startupsData.length,
                data: { startups: startupsData }
            })
        );
    }

    //route to get any startup data based on id provided
    else if (
        pathname.match(/\/api\/v1\/startups\/([0-9]+)/) &&
        req.method === "GET"
    ) {
        const id = pathname.split("/")[4] * 1;
        const startup = startupsData.find(ele => ele.id === id);

        //If startup of mentioned does not exist
        if (!startup) {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(
                JSON.stringify({
                    status: "fail",
                    message: "invalid ID",
                    code: 404
                })
            );
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({
                status: "success",
                data: { startup }
            })
        );
    }

    //404 route
    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({
                status: "fail",
                message: "Page not found",
                code: 404
            })
        );
    }
});

//Listen to given port
const PORT = process.env.PORT || 8080;
server.listen(PORT, "localhost", () =>
    console.log(`Server is running on http://127.0.0.1:${PORT}`)
);
