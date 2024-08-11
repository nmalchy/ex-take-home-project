import React, { useState } from 'react';
import { AxiosError } from 'axios';

import apiClient from '../lib/api-client';
import { FormData, MatchResult, SanctionsScreeningAPIResponse } from '../types';
import { ALL_FIELDS_REQUIRED_ERROR, GENERIC_SOMETHING_WENT_WRONG_ERROR } from '../constants/errors';

const SanctionsScreeningForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({ fullName: '', birthYear: '', country: '' });
    const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
    const [responseMessage, setResponseMessage] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();

        if (!formData.fullName || !formData.birthYear || !formData.country) {
            setErrorMessage(ALL_FIELDS_REQUIRED_ERROR);
            setMatchResult(null); // Reset state on error 
            setResponseMessage(''); // Reset state on error
            return;
        }

        setLoading(true); // Start loading

        await apiClient.post<FormData, { data: SanctionsScreeningAPIResponse }>('/api/v1/check-sanctions-list', formData)
            .then((response: { data: SanctionsScreeningAPIResponse }) => {
                if (response.data.isHit) {
                    setMatchResult(response.data.match);
                    setResponseMessage('Hit');
                    setErrorMessage(''); // Clear previous error messages
                } else {
                    setResponseMessage('Clear');
                    setMatchResult(null);
                    setErrorMessage(''); // Clear previous error messages
                }
            }).catch((error) => {
                const axiosError = error.response?.data?.error as AxiosError ?? GENERIC_SOMETHING_WENT_WRONG_ERROR
                // Use Sentry to log error in prod
                setErrorMessage(`${axiosError}`);
                setMatchResult(null); // Reset state on error
                setResponseMessage(''); // Reset state on error
            }).finally(() => setLoading(false));
    };

    return (
        <>
            <h3>Specially Designated Nationals Checker</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="fullName">Full Name:</label>
                    <input id="fullName" type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="birthYear">Birth Year:</label>
                    <input id="birthYear" type="text" name="birthYear" value={formData.birthYear} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="country">Country:</label>
                    <input id="country" type="text" name="country" value={formData.country} onChange={handleChange} />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? <span className="spinner"></span> : 'Submit'}
                </button>
            </form>

            {errorMessage && (
                <div style={{ color: 'red' }}>
                    <p>Error: {errorMessage}</p>
                </div>
            )}
            
            {responseMessage && (
                <div >
                    <h3>Result: {responseMessage}</h3>
                    {matchResult && (
                        <ul>
                            <li>Full Name: {matchResult.fullName ? '✅' : '❌'}</li>
                            <li>Birth Year: {matchResult.birthYear ? '✅' : '❌'}</li>
                            <li>Country: {matchResult.country ? '✅' : '❌'}</li>
                        </ul>
                    )}
                </div>
            )}
        </>
    );
};

export default SanctionsScreeningForm;
