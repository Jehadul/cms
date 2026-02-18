import api from './axiosConfig';

export const getPdcExposure = async () => {
    const response = await api.get('/pdc/exposure');
    return response.data;
};

export const runPdcCheck = async () => {
    const response = await api.post('/pdc/run-check');
    return response.data;
};
