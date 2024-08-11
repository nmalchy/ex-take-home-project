import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import apiClient from '../../lib/api-client';
import { ALL_FIELDS_REQUIRED_ERROR, GENERIC_SOMETHING_WENT_WRONG_ERROR } from '../../constants/errors';
import SanctionsScreeningForm from '../../components/SanctionsScreeningForm';


jest.mock('../../lib/api-client');

describe('SanctionsScreeningForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders form and handles input changes', () => {
        render(<SanctionsScreeningForm />);
        
        expect(screen.getByLabelText(/Full Name:/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Birth Year:/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Country:/i)).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText(/Full Name:/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/Birth Year:/i), { target: { value: '1990' } });
        fireEvent.change(screen.getByLabelText(/Country:/i), { target: { value: 'USA' } });
        
        expect(screen.getByLabelText(/Full Name:/i)).toHaveValue('John Doe');
        expect(screen.getByLabelText(/Birth Year:/i)).toHaveValue('1990');
        expect(screen.getByLabelText(/Country:/i)).toHaveValue('USA');
    });

    test('displays error message when fields are empty on submit', async () => {
        render(<SanctionsScreeningForm />);
        
        fireEvent.click(screen.getByText(/Submit/i));
        
        expect(await screen.findByText(`Error: ${ALL_FIELDS_REQUIRED_ERROR}`)).toBeInTheDocument();
    });

    test('displays result when API call is successful and user is a hit', async () => {
        const mockResponse = {
            data: {
                isHit: true,
                match: {
                    fullName: true,
                    birthYear: true,
                    country: true
                }
            }
        };
        (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

        render(<SanctionsScreeningForm />);
        
        fireEvent.change(screen.getByLabelText(/Full Name:/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/Birth Year:/i), { target: { value: '1990' } });
        fireEvent.change(screen.getByLabelText(/Country:/i), { target: { value: 'USA' } });
        
        fireEvent.click(screen.getByText(/Submit/i));
        
        await waitFor(() => expect(screen.getByText(/Hit/i)).toBeInTheDocument());
        expect(screen.getByText(/Full Name: ✅/i)).toBeInTheDocument();
        expect(screen.getByText(/Birth Year: ✅/i)).toBeInTheDocument();
        expect(screen.getByText(/Country: ✅/i)).toBeInTheDocument();
    });

    test('displays result when API call is successful and user is not a hit', async () => {
        const mockResponse = {
            data: {
                isHit: false
            }
        };
        (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

        render(<SanctionsScreeningForm />);
        
        fireEvent.change(screen.getByLabelText(/Full Name:/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/Birth Year:/i), { target: { value: '1990' } });
        fireEvent.change(screen.getByLabelText(/Country:/i), { target: { value: 'USA' } });
        
        fireEvent.click(screen.getByText(/Submit/i));
        
        await waitFor(() => expect(screen.getByText(/Clear/i)).toBeInTheDocument());
    });

    test('displays generic error message when API call fails', async () => {
        (apiClient.post as jest.Mock).mockRejectedValue(new Error(GENERIC_SOMETHING_WENT_WRONG_ERROR));

        render(<SanctionsScreeningForm />);
        
        fireEvent.change(screen.getByLabelText(/Full Name:/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/Birth Year:/i), { target: { value: '1990' } });
        fireEvent.change(screen.getByLabelText(/Country:/i), { target: { value: 'USA' } });
        
        fireEvent.click(screen.getByText(/Submit/i));
        
        await waitFor(() => expect(screen.getByText(`Error: ${GENERIC_SOMETHING_WENT_WRONG_ERROR}`)).toBeInTheDocument());
    });
});
