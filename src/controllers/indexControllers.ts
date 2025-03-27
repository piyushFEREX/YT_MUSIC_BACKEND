import { Request, Response } from 'express';

export const homeRoute = (req: Request, res: Response) => {
  res.send('Hello World!');
}