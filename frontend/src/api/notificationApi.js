import api from './axiosConfig';

export const getNotifications = async (companyId) => {
    const response = await api.get('/notifications', { params: { companyId } });
    return response.data;
};

export const markAsRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
};

export const getAlertConfig = async (companyId) => {
    const response = await api.get(`/alert-configs/${companyId}`);
    return response.data;
};

export const updateAlertConfig = async (companyId, config) => {
    const response = await api.put(`/alert-configs/${companyId}`, config);
    return response.data;
};
