const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

const mimeTypes = {
    ".html": "text/html",
    ".js": "application/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
    let filePath = req.url === "/" ? "/index.html" : req.url;
    filePath = path.join(__dirname, filePath);

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || "text/plain";

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end("404 Not Found");
            return;
        }
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`\n✅ Universal Decoder running at:`);
    console.log(`   http://localhost:${PORT}\n`);
});
