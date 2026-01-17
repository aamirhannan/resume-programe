
import { Response } from 'express';

export abstract class BaseController {
    /**
     * Send a success response (200 OK)
     */
    protected ok<T>(res: Response, dto?: T) {
        if (dto) {
            return res.status(200).json(dto);
        } else {
            return res.sendStatus(200);
        }
    }

    /**
     * Send a created response (201 Created)
     */
    protected created<T>(res: Response, dto?: T) {
        if (dto) {
            return res.status(201).json(dto);
        } else {
            return res.sendStatus(201);
        }
    }

    /**
     * Send a client error response (400 Bad Request)
     */
    protected clientError(res: Response, message?: string) {
        return res.status(400).json({
            success: false,
            error: message || 'Bad Request'
        });
    }

    /**
     * Send an unauthorized response (401 Unauthorized)
     */
    protected unauthorized(res: Response, message?: string) {
        return res.status(401).json({
            success: false,
            error: message || 'Unauthorized'
        });
    }

    /**
     * Send a not found response (404 Not Found)
     */
    protected notFound(res: Response, message?: string) {
        return res.status(404).json({
            success: false,
            error: message || 'Not Found'
        });
    }

    /**
     * Send a generic error response (500 Internal Server Error)
     */
    protected fail(res: Response, error: Error | string) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.toString()
        });
    }
}
