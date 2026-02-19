import api from './axiosConfig';

export const getChequeBooksByAccount = async (accountId) => {
    const response = await api.get(`/cheque-books?accountId=${accountId}`);
    return response.data;
};

export const getChequeBookById = async (id) => {
    const response = await api.get(`/cheque-books/${id}`);
    return response.data;
};

export const getChequesByBook = async (id) => {
    const response = await api.get(`/cheque-books/${id}/cheques`);
    return response.data;
};

export const createChequeBook = async (data) => {
    const response = await api.post('/cheque-books', data);
    return response.data;
};

export const updateChequeStatus = async (chequeId, status, remarks) => {
    const response = await api.patch(`/cheque-books/cheques/${chequeId}/status`, { status, remarks });
    return response.data;
};

export const createOutgoingCheque = async (chequeData) => {
    const response = await api.post('/cheque-books/outgoing', chequeData);
    return response.data;
};
