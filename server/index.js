import 'dotenv/config';
import express from "express";
import {registerRoutes} from "./routes.js";
import {setupVite, serveStatic, log} from "./vite.js";
import {connectDB} from "./db.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
            let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
            if (capturedJsonResponse) {
                logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
            }

            if (logLine.length > 80) {
                logLine = logLine.slice(0, 79) + "…";
            }

            log(logLine);
        }
    });

    next();
});

(async () => {
    // try connect to db
    try {
        await connectDB();
        log("Using MongoDB storage");
    } catch (error) {
        log("Failed to connect to MongoDB, continuing with application...");
    }

    const server = await registerRoutes(app);

    
    if (app.get("env") === "development") {
        await setupVite(app, server);
    } else {
        serveStatic(app);
    }

    // Error handler should be after Vite setup
    app.use((err, _req, res, _next) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";

        res.status(status).json({message});
        throw err;
    });

    // Use port 5000 to match vite config
    const port = parseInt(process.env.PORT || '5000', 10);
    server.listen(port, "0.0.0.0", () => {
        log(`serving on port ${port}`);
    });
})();