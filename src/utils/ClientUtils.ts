import { parse } from "path";

export class ClientUtils {
    public async import<T>(path: string, ...args: any[]): Promise<T | undefined> {
        const file = await import(path).then(
            m => (m as Record<string, (new (...argument: any[]) => T) | undefined>)[parse(path).name]
        );

        return file ? new file(...(args as unknown[])) : undefined;
    }
}