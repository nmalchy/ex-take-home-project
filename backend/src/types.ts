export type OFACResponseData = {
    fullName: string;
    birthYear: string;
    country: string;
};

export type OFACRequestData = {
    apiKey: string | undefined;
    minScore: number;
    sources: string[];
    types: string[];
    cases: [{
        name: string;
        type: string;
        dob: string;
        country: string;
    }]
}

export type MatchResult = {
    fullName: boolean;
    birthYear: boolean;
    country: boolean;
};

export type ApiResponse = {
    isHit: boolean;
    match: MatchResult;
};
