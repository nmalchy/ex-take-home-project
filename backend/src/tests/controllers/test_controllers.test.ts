import { Request, Response } from 'express';
import { SERVER_500_ERROR_CODE, GENERIC_SOMETHING_WENT_WRONG_ERROR } from '../../constants/errors';
import { checkSanctionsList } from '../../controllers/ofac-controller';
import { cache } from '../../lib/cache';
import { checkSanctionedUsersList } from '../../utils';

jest.mock('../../utils', () => ({
    checkSanctionedUsersList: jest.fn(),
}));

jest.mock('../../lib/cache', () => ({
    cache: {
        get: jest.fn(),
        set: jest.fn(),
    },
}));

describe('checkSanctionsList', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let json: jest.Mock;
    let status: jest.Mock;

    beforeEach(() => {
        json = jest.fn();
        status = jest.fn().mockReturnValue({ json });

        req = {
            body: {},
        };

        res = {
            json,
            status,
        };
    });

    it('should return cached data if available', () => {
        req.body = {
            fullName: 'Noah Malchy',
            birthYear: '1969',
            country: 'USA',
        };

        const cacheKey = 'Noah Malchy-1969-USA';
        const cachedResponse = { isSanctioned: true };

        (cache.get as jest.Mock).mockReturnValue(cachedResponse);

        checkSanctionsList(req as Request, res as Response);

        expect(cache.get).toHaveBeenCalledWith(cacheKey);
        expect(res.json).toHaveBeenCalledWith(cachedResponse);
        expect(res.status).not.toHaveBeenCalled();
    });

    it('should fetch and cache data if not available in cache', () => {
        req.body = {
            fullName: 'Adam Kang',
            birthYear: '1995',
            country: 'Canada',
        };

        const cacheKey = 'Adam Kang-1995-Canada';
        const result = { isSanctioned: false };

        (cache.get as jest.Mock).mockReturnValue(undefined);
        (checkSanctionedUsersList as jest.Mock).mockReturnValue(result);

        checkSanctionsList(req as Request, res as Response);

        expect(cache.get).toHaveBeenCalledWith(cacheKey);
        expect(checkSanctionedUsersList).toHaveBeenCalledWith(expect.any(Array), 'Adam Kang', '1995', 'Canada');
        expect(cache.set).toHaveBeenCalledWith(cacheKey, result);
        expect(res.json).toHaveBeenCalledWith(result);
        expect(res.status).not.toHaveBeenCalled();
    });

    it('should handle errors and respond with 500', () => {
        req.body = {
            fullName: 'Unknown User',
            birthYear: '0000',
            country: 'Nowhere',
        };

        (checkSanctionedUsersList as jest.Mock).mockImplementation(() => {
            throw new Error('Test Error');
        });

        checkSanctionsList(req as Request, res as Response);

        expect(res.status).toHaveBeenCalledWith(SERVER_500_ERROR_CODE);
        expect(res.json).toHaveBeenCalledWith({ error: GENERIC_SOMETHING_WENT_WRONG_ERROR });
    });
});
