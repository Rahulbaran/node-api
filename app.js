"use strict";

import http from "http";

//Create Server
const server = http.createServer();

server.on("request", (req, res) => {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "success" }));
});

//Listen to given port
const PORT = 8080;
server.listen(PORT, "localhost", () =>
    console.log(`Server is running on http://127.0.0.1:${PORT}`)
);
