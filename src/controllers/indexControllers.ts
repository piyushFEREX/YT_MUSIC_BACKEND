import { Request, Response } from 'express';

export const homeRoute = (req: Request, res: Response) => {
  res.send('Hello World!');
}

export const profileRoute = (req: Request, res: Response) => {
  res.send('Profile Page!');
}