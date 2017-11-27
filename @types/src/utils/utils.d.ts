export declare function noop(): void;
export declare function isType<T>(type: string): (v: any) => v is T;
export declare function isFunction<T extends Function>(value: any): value is T;
export declare function isObject<T extends Object>(value: any): value is T;
export declare function isArray<T>(value: any): value is Array<T>;
export declare function isUndefined(value: any): value is undefined;
export declare function isString(value: any): value is string;
export declare function isNumber(value: any): value is number;
export declare const getPrototypeOf: (o: any) => any;
export declare function isPureObject<T>(value: any): value is T;
export declare function warning(expected: boolean, message: string): void;
export declare function assert(expected: boolean, message: string): void | never;
export declare function freeze<T extends Object>(obj: T): T;
export declare function assign(object: any, ...otherArgs: any[]): any;
export declare function find<T>(arr: T[], filter: (v: T, index: number, arr: T[]) => boolean): T | undefined;
export declare function every<T>(arr: T[], filter: (v: T, index: number, arr: T[]) => boolean): boolean;
export declare function keys(obj: {
    [key: string]: any;
}): string[];
