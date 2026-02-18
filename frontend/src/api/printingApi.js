import api from './axiosConfig';

export const getChequePdf = async (chequeId, templateId) => {
    const response = await api.get(`/printing/cheque/${chequeId}/template/${templateId}`, {
        responseType: 'blob', // Important for PDF download
    });
    return response.data;
};

export const getBatchChequePdf = async (chequeIds, templateId) => {
    const response = await api.post(`/printing/batch/template/${templateId}`, chequeIds, {
        responseType: 'blob',
    });
    return response.data;
};
