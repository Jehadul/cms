import api from './axiosConfig';

export const getNotifications = async (companyId) => {
    const response = await api.get('/notifications', { params: { companyId } });
    return response.data;
};

export const markAsRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
};
