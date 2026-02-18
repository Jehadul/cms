import api from './axiosConfig';

export const getAccountsByCompany = async (companyId) => {
    const response = await api.get(`/bank-accounts?companyId=${companyId}`);
    return response.data;
};

export const getAccountById = async (id) => {
    const response = await api.get(`/bank-accounts/${id}`);
    return response.data;
};

export const createAccount = async (accountData) => {
    const response = await api.post('/bank-accounts', accountData);
    return response.data;
};

export const updateAccount = async (id, accountData) => {
    const response = await api.put(`/bank-accounts/${id}`, accountData);
    return response.data;
};

export const deleteAccount = async (id) => {
    await api.delete(`/bank-accounts/${id}`);
};
