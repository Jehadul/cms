import axios from 'axios';

const API_BASE_URL = '/api/audit-logs';

export const getAuditLogs = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(API_BASE_URL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export const getAuditLogExportUrl = () => {
    return API_BASE_URL + '/export';
}
