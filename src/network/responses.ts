import { Request, Response } from 'express';

class Responses {
    constructor() { }

    success = (props: { req: Request, res: Response, status?: number, body?: any }) => {
        props.res.status(props.status || 200).send({
            error: false,
            status: props.status || 200,
            body: props.body || ""
        });
    };

    error = (props: { req: Request, res: Response, status?: number, body?: any }) => {
        props.res.status(props.status || 500).send({
            error: true,
            status: props.status || 500,
            body: props.body || ""
        });
    };
}

export const { success, error } = new Responses();