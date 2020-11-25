import { Router } from 'express';

export abstract class AppRouter{
    abstract router: Router;
    abstract addRoutes(): void;
}
