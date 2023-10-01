import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
    path: path.join(__dirname, "..", "..", '.env')
});

export abstract class ConfigServer {
    constructor() { }

    public getEnvironment(env: string) {
        return process.env[env];
    }

    public getNumberEnvironment(env: string): number {
        return Number(this.getEnvironment(env));
    }

    public createPathEnv(path: string): string {
        const arrEnv: Array<string> = ["env"]
        if (path.length > 0) {
            const stringToArray = path.split(".");
            arrEnv.unshift(...stringToArray);
        }
        return "." + arrEnv.join(".");
    }

    public get dbConnection() {
        return {
            database: this.getEnvironment('MSSQL_DATABASE'),
            user: this.getEnvironment('MSSQL_USER'),
            password: this.getEnvironment('MSSQL_PASS'),
            host: this.getEnvironment('MSSQL_HOST'),
            port: this.getNumberEnvironment('MSSQL_PORT'),
        }
    }
}