import { Request, Response, NextFunction } from "express";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const originalSend = res.send; // Store original `res.send` method

  let responseBody: any; // To capture response body

  // Intercept `res.send` to capture response body
  res.send = function (body: any): Response {
    responseBody = body; // Store response body
    return originalSend.call(this, body); // Call original `send`
  };

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
      ✅ Response Headers: ${JSON.stringify(res.getHeaders())}
      ✅ Response Body: ${JSON.stringify(responseBody)}
      ✅ Response Time: ${duration}ms
    `);
  });

  next();
};
