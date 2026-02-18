import api from './axiosConfig';

export const getVendorsByCompany = async (companyId) => {
    const response = await api.get(`/vendors?companyId=${companyId}`);
    return response.data;
};

export const getVendorById = async (id) => {
    const response = await api.get(`/vendors/${id}`);
    return response.data;
};

export const createVendor = async (vendorData) => {
    const response = await api.post('/vendors', vendorData);
    return response.data;
};

export const updateVendor = async (id, vendorData) => {
    const response = await api.put(`/vendors/${id}`, vendorData);
    return response.data;
};

export const deleteVendor = async (id) => {
    await api.delete(`/vendors/${id}`);
};
