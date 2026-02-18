import api from './axiosConfig';

export const getAllCompanies = async () => {
    const response = await api.get('/companies');
    return response.data;
};

export const getCompanyById = async (id) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
};

export const createCompany = async (companyData) => {
    const response = await api.post('/companies', companyData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateCompany = async (id, companyData) => {
    const response = await api.put(`/companies/${id}`, companyData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteCompany = async (id) => {
    await api.delete(`/companies/${id}`);
};
