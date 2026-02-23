import api from './axiosConfig';

export const getPendingApprovals = async () => {
    const response = await api.get('/workflow/pending');
    return response.data;
};

export const approveRequest = async (id) => {
    await api.post(`/workflow/approve/${id}`);
};

export const rejectRequest = async (id) => {
    await api.post(`/workflow/reject/${id}`);
};

export const createApprovalRequest = async (data) => {
    const response = await api.post('/workflow/request', data);
    return response.data;
};
