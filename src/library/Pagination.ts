import { Request } from 'express';

export type PaginationLimit = 10 | 25 | 50;

export type PaginationParams = {
    limit: PaginationLimit;
    page: number;
};

const ALLOWED_LIMITS = new Set([10, 25, 50]);

export const parsePagination = (query: Request['query']): PaginationParams | undefined => {
    const hasLimit = query.limit !== undefined;
    const hasPage = query.page !== undefined;

    if (!hasLimit && !hasPage) {
        return undefined;
    }

    // If only one pagination param is provided, ignore pagination and return full list.
    if (hasLimit !== hasPage) {
        return undefined;
    }

    const parsedLimit = Number(query.limit);
    const parsedPage = Number(query.page);

    const limit = ALLOWED_LIMITS.has(parsedLimit) ? (parsedLimit as PaginationLimit) : 10;
    const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

    return { limit, page };
};
