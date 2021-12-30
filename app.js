"use strict";

import dotenv from "dotenv";
import http from "http";
import fs from "fs";
import url from "url";

//LOAD ALL THE ENVIRONMENT VARIABLES
dotenv.config();

//CREATE A HTTP SERVER
const server = http.createServer();

// 1) READ STARTUP JSON FILE AND STORE ITS DATA IN VARIABLE
const startupsData = JSON.parse(
    fs.readFileSync(`./data/startups.json`, "utf-8")
);

// 2) ROUTES
server.on("request", (req, res) => {
    const { pathname } = url.parse(req.url, true);

    //ROUTE TO GET ALL THE STARTUPS DATA
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

    //ROUTE TO GET ANY STARTUP DATA BASED ON ID PROVIDED
    else if (
        pathname.match(/\/api\/v1\/startups\/([0-9]+)/) &&
        req.method === "GET"
    ) {
        const id = pathname.split("/")[4] * 1;
        const startup = startupsData.find(ele => ele.id === id);

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

    //ROUTE TO ADD NEW STARTUP DATA USING POST
    else if (pathname === "/api/v1/startups" && req.method === "POST") {
        req.on("data", chunk => {
            const data = JSON.parse(chunk);
            const newId = startupsData[startupsData.length - 1].id + 1;

            const newStartup = Object.assign({ id: newId }, data);
            startupsData.push(newStartup);

            fs.writeFile(
                `./data/startups.json`,
                JSON.stringify(startupsData),
                err => {
                    if (err) {
                        res.writeHead(404, {
                            "Content-Type": "application/json"
                        });
                        return res.end(
                            JSON.stringify({ status: "fail", code: 404 })
                        );
                    }
                }
            );
            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({
                    status: "success",
                    data: { startup: newStartup }
                })
            );
        });
        res.on("end", () => {
            res.end();
        });
    }

    //404 ROUTE
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

// 3) START SERVER
const PORT = process.env.PORT || 8080;
server.listen(PORT, "localhost", () =>
    console.log(`Server is running on http://127.0.0.1:${PORT}`)
);
