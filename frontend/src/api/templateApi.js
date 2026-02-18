import api from './axiosConfig';

export const getAllTemplates = async () => {
    const response = await api.get('/templates');
    return response.data;
};

export const getTemplateById = async (id) => {
    const response = await api.get(`/templates/${id}`);
    return response.data;
};

export const createTemplate = async (template) => {
    const response = await api.post('/templates', template);
    return response.data;
};

export const updateTemplate = async (id, template) => {
    const response = await api.put(`/templates/${id}`, template);
    return response.data;
};

export const deleteTemplate = async (id) => {
    await api.delete(`/templates/${id}`);
};
