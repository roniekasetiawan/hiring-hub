import { NextResponse } from 'next/server';

export type SuccessBody<T = unknown> = {
    statusCode: number;
    message: string;
    data: T | null;
};

export type ErrorBody<T = unknown> = {
    statusCode: number;
    message: string;
    error?: T;
};

const isJsonString = (s?: string) => {
    if (!s) return false;
    try { JSON.parse(s); return true; } catch { return false; }
};

export function success<T = unknown>(
    data: T | null = null,
    statusCode = 200,
    message = 'Success'
) {
    const body: SuccessBody<T> = { statusCode, message, data };
    return NextResponse.json(body, { status: statusCode });
}

export function error<T = unknown>(
    errData: T | null = null,
    statusCode = 400,
    message = 'Failed'
) {
    let finalMessage = message;
    if (isJsonString(message)) {
        const decoded = JSON.parse(message);
        finalMessage = decoded?.message ?? decoded?.responseDesc ?? 'Terjadi kesalahan';
    }
    const body: ErrorBody<T> = { statusCode, message: finalMessage, error: errData ?? undefined };
    return NextResponse.json(body, { status: statusCode });
}

export function validationError<T extends Record<string, unknown>>(
    validationErrors: T,
    statusCode = 422,
    message = 'Validation Failed'
) {
    const body = { statusCode, message, validationErrors };
    return NextResponse.json(body, { status: statusCode });
}

export function paginated<T = unknown>(
    data: T[],
    limit: number,
    total: number,
    message = 'Success',
    statusCode = 200
) {
    const pages = Math.max(1, Math.ceil((total ?? 0) / Math.max(1, limit ?? 1)));
    const res = NextResponse.json<SuccessBody<T[]>>(
        { statusCode, message, data },
        { status: statusCode }
    );
    res.headers.set('pagination-pages', String(pages));
    res.headers.set('pagination-rows', String(total ?? 0));
    return res;
}

export function fileDownload(
    content: string | Buffer | Uint8Array,
    fileName: string,
    mimeType = 'application/octet-stream'
) {
    return new NextResponse(content as any, {
        status: 200,
        headers: new Headers({
            'Content-Type': mimeType,
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Cache-Control': 'no-store',
        }),
    });
}

export function safe<T>(fn: () => Promise<Response>): Promise<Response> {
    return fn().catch((e: any) => {
        const msg = e?.message ?? 'Internal Server Error';
        const details = e?.cause ?? e;
        return error(details, 500, msg);
    });
}
