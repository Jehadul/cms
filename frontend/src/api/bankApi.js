import api from './axiosConfig';

// Bank APIs
export const getAllBanks = async () => {
    const response = await api.get('/banks');
    return response.data;
};

export const getBankById = async (id) => {
    const response = await api.get(`/banks/${id}`);
    return response.data;
};

export const createBank = async (bankData) => {
    const response = await api.post('/banks', bankData);
    return response.data;
};

export const updateBank = async (id, bankData) => {
    const response = await api.put(`/banks/${id}`, bankData);
    return response.data;
};

export const deleteBank = async (id) => {
    await api.delete(`/banks/${id}`);
};

// Branch APIs
export const getBranchesByBank = async (bankId) => {
    const response = await api.get(`/branches?bankId=${bankId}`);
    return response.data;
};

export const getBranchById = async (id) => {
    const response = await api.get(`/branches/${id}`);
    return response.data;
};

export const createBranch = async (branchData) => {
    const response = await api.post('/branches', branchData);
    return response.data;
};

export const updateBranch = async (id, branchData) => {
    const response = await api.put(`/branches/${id}`, branchData);
    return response.data;
};

export const deleteBranch = async (id) => {
    await api.delete(`/branches/${id}`);
};
