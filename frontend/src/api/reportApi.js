
import api from './axiosConfig';

export const getReportData = async (filters) => {
    const response = await api.post('/reports/data', filters);
    return response.data;
};

export const exportReport = async (filters, type) => {
    const response = await api.post(`/reports/export/${type}`, filters, {
        responseType: 'blob', // Important for file downloads
    });
    return response.data;
};
