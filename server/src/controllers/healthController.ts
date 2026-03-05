import { Request, Response } from 'express';

export class HealthController {
  static getHealth(req: Request, res: Response): void {
    res.json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
      },
    });
  }
}
