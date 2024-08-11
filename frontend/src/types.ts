export type FormData = {
    fullName: string;
    birthYear: string;
    country: string;
};

export type MatchResult = {
    fullName: boolean;
    birthYear: boolean;
    country: boolean;
}

export type SanctionsScreeningAPIResponse = {
    match: MatchResult
    isHit: boolean
}
