import * as express from 'express';

export interface Environment {
  port: number;
  controllersPath: string[];
}
