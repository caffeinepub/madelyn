import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface Item {
    id: string;
    timestamp: Time;
    category: Category;
    photo?: ExternalBlob;
}
export type Category = {
    __kind__: "Tin";
    Tin: null;
} | {
    __kind__: "Book";
    Book: {
        name: string;
        year: bigint;
    };
} | {
    __kind__: "Patch";
    Patch: null;
} | {
    __kind__: "Uniform";
    Uniform: null;
};
export interface backendInterface {
    addItem(id: string, category: Category, photo: ExternalBlob | null): Promise<void>;
    filterByCategory(category: Category): Promise<Array<Item>>;
    getItem(id: string): Promise<Item>;
    listItems(): Promise<Array<Item>>;
    sortBooksByYear(): Promise<Array<Item>>;
}
