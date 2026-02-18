import api from './axiosConfig';

export const getAllIncomingCheques = async () => {
    const response = await api.get('/incoming-cheques');
    return response.data;
};

export const createIncomingCheque = async (chequeData, file) => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(chequeData));
    if (file) {
        formData.append('file', file);
    }
    const response = await api.post('/incoming-cheques', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const updateIncomingCheque = async (id, chequeData, file) => {
    const formData = new FormData();
    formData.append('data', JSON.stringify(chequeData));
    if (file) {
        formData.append('file', file);
    }
    const response = await api.put(`/incoming-cheques/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteIncomingCheque = async (id) => {
    await api.delete(`/incoming-cheques/${id}`);
};
