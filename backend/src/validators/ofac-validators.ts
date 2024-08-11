import { Request, Response } from 'express';
import { isValidBirthYear, normalize } from '../utils';
import { ALL_FIELDS_REQUIRED_ERROR, GENERIC_400_ERROR_CODE, INVALID_BIRTH_YEAR_ERROR, INVALID_COUNTRY_ERROR, INVALID_FULL_NAME_ERROR } from '../constants/errors';
import { OFACResponseData } from '../types';
import { countryList } from '../constants/country-list';

export const validateSanctionedUsersCheckRequest = (req: Request, res: Response, next: () => void) => {
    const { fullName, birthYear, country } = req.body as OFACResponseData;

    // Should be first lest front-end validation failed for some reason
    if (!fullName || !birthYear || !country) {
        return res.status(GENERIC_400_ERROR_CODE).json({ error: ALL_FIELDS_REQUIRED_ERROR });
    }

    const fullNameRegex: RegExp = /^[A-Za-z\s]+$/;
    if (!fullNameRegex.test(fullName)) {
        return res.status(GENERIC_400_ERROR_CODE).json({ error: INVALID_FULL_NAME_ERROR });
    }

    if (!isValidBirthYear(birthYear)) {
        return res.status(GENERIC_400_ERROR_CODE).json({ error: INVALID_BIRTH_YEAR_ERROR });
    }

    const normalizedCountry: string = normalize(country);
    const isValidCountry: boolean = countryList.some(country => normalize(country) === normalizedCountry);

    if (!isValidCountry) {
        return res.status(GENERIC_400_ERROR_CODE).json({ error: INVALID_COUNTRY_ERROR });
    }

    next();
};

// Add more validators as app grows
