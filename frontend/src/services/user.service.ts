import { api } from './api';

export interface UpdateProfileData {
    nom_utilisateur?: string;
    email?: string;
}

export const userService = {
    getProfile: (userId: string) => api.get(`/utilisateurs/${userId}`),
    updateProfile: (userId: string, data: UpdateProfileData) =>
        api.patch(`/utilisateurs/${userId}`, data),
};
