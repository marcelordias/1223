import { Response, NextFunction, Request } from "express";

export const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    console.log(`
        ------------------------------
        ${new Date().toLocaleString()}
        Incoming Request:
        Method: ${req.method}
        URL: ${req.url}
        Headers: ${JSON.stringify(req.headers)}
        Body: ${JSON.stringify(req.body)}
        ------------------------------
    `);

    res.on("finish", () => {
        const { method, url } = req;
        const { statusCode, statusMessage } = res;
        const contentLength = res.get("Content-Length");
        const contentType = res.get("Content-Type");
        const duration = Date.now() - start;

        console.log(`
            ------------------------------
            ${new Date().toLocaleString()}
            Outgoing Response:
            Method: ${method}
            URL: ${url}
            Status: ${statusCode} ${statusMessage}
            Content-Length: ${contentLength}
            Content-Type: ${contentType}
            Headers: ${JSON.stringify(res.getHeaders())}
            Duration: ${duration}ms
            ------------------------------
        `);
    });

    next();
};
