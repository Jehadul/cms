import api from './axiosConfig';

export const downloadReceipt = async (chequeId) => {
    const response = await api.get(`/receipts/download/${chequeId}`, {
        responseType: 'blob',
    });
    return response.data;
};

export const emailReceipt = async (chequeId, email) => {
    await api.post(`/receipts/email/${chequeId}`, { email });
};
