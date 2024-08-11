import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_SERVER_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add interceptors that handle error messages from backend and combine with state management solution for displaying to the UI throughout app in real app

export default apiClient;
