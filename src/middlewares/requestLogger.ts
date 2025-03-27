import { Request, Response, NextFunction } from "express";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  console.log(`
    🔹 [${new Date().toISOString()}] Incoming Request
    🔹 Method: ${req.method}
    🔹 URL: ${req.originalUrl}
    🔹 Query Params: ${JSON.stringify(req.query)}
    🔹 Request Body: ${JSON.stringify(req.body)}
  `);

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`
      ✅ [${new Date().toISOString()}] Response Sent
      ✅ Status: ${res.statusCode}
      ✅ Response Time: ${duration}ms
    `);
  });

  next();
};
