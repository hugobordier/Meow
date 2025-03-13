import { User } from "@/types/user";
import { api } from "./api";

export const register = async (user: User) => {
    try {
        const response = await api.post("/authRoutes/register", {
            username: user.username,
            email: user.email,
            password: user.password,
            lastName: user.lastName,
            firstName: user.firstName,
            age: user.age,
            birthDate: user.birthDate,
            city: user.city,
            country: user.country,
            gender: user.gender,
            profilePicture: user.profilePicture,
            bio: user.bio,
            bankInfo: user.bankInfo,
            rating: user.rating,
            phoneNumber: user.phoneNumber,
            address: user.address,
            identityDocument: user.identityDocument,
            insuranceCertificate: user.insuranceCertificate,
            isAdmin: user.isAdmin,
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.log(error)
        //@ts-ignore
        throw error.response.data.error;
    }
};