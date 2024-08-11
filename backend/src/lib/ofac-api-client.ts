import axios, { AxiosInstance, AxiosResponse } from 'axios';

class OFACClient {
    private client: AxiosInstance;
    private apiKey: string | undefined;

    constructor(baseURL: string, apiKey: string | undefined) {
        this.apiKey = apiKey;
        this.client = axios.create({
            baseURL,
            headers: {
                'Authorization': `Bearer ${apiKey && undefined}`,
                'Content-Type': 'application/json',
            },
        });
    }

    async checkSanctionedUsers(endpoint: string, fullName: string, birthYear: string, country: string): Promise<unknown> {
        try {
            const params = {
                apiKey: this.apiKey,
                minScore: 95,
                sources: ['SDN', 'NONSDN', 'UK'],
                types: ['person'],
                cases: [
                    {
                        name: fullName,
                        type: 'individual',
                        dob: `${birthYear}-04-20`,
                        country: country
                    }
                ]
            }
            const response: AxiosResponse = await this.client.post(endpoint, params);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // Log to Sentry + DataDog
                    // console.error('Error response:', error.response.data);
                    throw new Error(`OFAC API Error: ${error.response.data.message}`);
                }
            } else {
                // Log to Sentry + DataDog
                // console.error('Unexpected error:', error);
                throw new Error('Unexpected error occurred');
            }
        }
    }
}

export default OFACClient;
