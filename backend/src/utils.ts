import { BIRTH_YEAR_MINIMUM, MINIMUM_AGE } from "./constants/miscellaneous";
import { ApiResponse, OFACResponseData, MatchResult } from "./types";

export const normalize = (str: string): string => str.toLowerCase().replace(/\s+/g, '').trim();

export const isValidBirthYear = (birthYear: string): boolean => {
    const birthYearNumber: number = Number(birthYear);
    const currentYear: number = new Date().getFullYear();
    return birthYearNumber >= BIRTH_YEAR_MINIMUM && (currentYear - birthYearNumber) >= MINIMUM_AGE;
};

export const checkSanctionedUsersList = (
    sanctionedUsersList: OFACResponseData[],
    fullName: string,
    birthYear: string,
    country: string
): ApiResponse => {

    // Ensure users don't get missed due to case sensitivity and/or whitespace
    const normalizedFullName: string = normalize(fullName);
    const normalizedBirthYear: string = normalize(birthYear);
    const normalizedCountry: string = normalize(country);

    const match: MatchResult = {
        fullName: false,
        birthYear: false,
        country: false
    };

    let isHit: boolean = false;

    sanctionedUsersList.forEach((entry: OFACResponseData) => {
        const entryFullName: string = normalize(entry.fullName);
        const entryBirthYear: string = normalize(entry.birthYear);
        const entryCountry: string = normalize(entry.country);

        if (entryFullName === normalizedFullName) {
            match.fullName = true;

            if (entryBirthYear === normalizedBirthYear) {
                match.birthYear = true;
            }
            if (entryCountry === normalizedCountry) {
                match.country = true;
            }

            isHit = true;
        }
    });

    return { isHit, match };
};
