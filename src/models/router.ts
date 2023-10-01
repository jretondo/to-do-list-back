import { Router } from "express";

export class BaseRouter<T, U> {
    public router: Router;
    public controller: T;
    public middleware: U;
    public singularURL: string;
    public pluralURL: string;
    constructor(TController: { new(): T }, UMiddleware: { new(): U }, singularURL: string, pluralURL: string) {
        this.singularURL = singularURL;
        this.pluralURL = pluralURL;
        this.router = Router();
        this.controller = new TController();
        this.middleware = new UMiddleware();
        this.routes();
    }
    routes() { }
}