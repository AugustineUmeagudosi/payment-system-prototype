import { NextApiRequest, NextApiResponse } from 'next';

// Middleware type definition
type Middleware = (req: NextApiRequest, res: NextApiResponse, next: () => void) => void;

// Function to sequentially apply middleware functions
export const applyMiddleware = (
    req: NextApiRequest,
    res: NextApiResponse,
    middlewares: Middleware[],
    handler: (req: NextApiRequest, res: NextApiResponse) => void
) => {
    const next = () => {
        const middleware = middlewares.shift(); // Get the next middleware
        if (middleware) middleware(req, res, next); // Apply the middleware
        else handler(req, res); // All middleware applied, call the handler
    };
    next(); // Start the middleware chain
};

