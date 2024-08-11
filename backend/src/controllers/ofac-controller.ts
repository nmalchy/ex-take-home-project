import { Request, Response } from 'express';
import { checkSanctionedUsersList } from '../utils';
import { OFACResponseData, ApiResponse } from '../types';
import { GENERIC_SOMETHING_WENT_WRONG_ERROR, SERVER_500_ERROR_CODE } from '../constants/errors';
import { cache } from '../lib/cache';
import OFACClient from '../lib/ofac-api-client';
import { OFAC_API_BASE_URL } from '../constants/config';
import dotenv from 'dotenv';

dotenv.config();

const sanctionedUsersList: OFACResponseData[] = [
    { fullName: 'Justin Trudeau', birthYear: '1971', country: 'Canada' },
    { fullName: 'Pierre Poilievre', birthYear: '1979', country: 'Canada' },
    { fullName: 'Donald Trump', birthYear: '1946', country: 'USA' },
    { fullName: 'Kamala Harris', birthYear: '1964', country: 'USA' },
];

const ofacClient = new OFACClient(OFAC_API_BASE_URL, process.env.OFAC_API_KEY);

export const checkSanctionsList = async (req: Request, res: Response) => {
    try {
        const { fullName, birthYear, country } = req.body as OFACResponseData;

        const cacheKey: string = `${fullName}-${birthYear}-${country}`;
        const cachedResponse: ApiResponse | undefined = cache.get<ApiResponse>(cacheKey);

        if (cachedResponse) {
            return res.json(cachedResponse);
        }


        // Doesn't work as API key returns unauthorized error
        // const ofacResponse = await ofacClient.checkSanctionedUsers('/', fullName, birthYear, country);

        const result: ApiResponse = checkSanctionedUsersList(sanctionedUsersList, fullName, birthYear, country);


        cache.set(cacheKey, result);

        return res.json(result);
    } catch (error) {
        return res.status(SERVER_500_ERROR_CODE).json({ error: GENERIC_SOMETHING_WENT_WRONG_ERROR });
    }
};

// Add more OFAC controllers as app grows
