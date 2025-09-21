import { APIRequestContext } from "@playwright/test";
import { BASE_URL } from "../constants/constants.ts"; 
import dotenv from 'dotenv';

//todo: update every client to create the APIRequestContext from request.createContext() instead of using DI in the constructor
dotenv.config();

export class PetClient{
    constructor(private request: APIRequestContext) {}

    // Create a new pet
    async createPet(petData: {
        id: number;
        category: {
            id: number;
            name: string;
        };
        name: string;
        photoUrls: string[];
        tags: {
            id: number;
            name: string;
        }[];
        status: string;
    }){
        const response = await this.request.post(`${BASE_URL}/pet`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            data: petData,
        });
        return response;
    }

    // Create a new pet with invalid data
    async createPetWithInvalidData(petData: any){
        const response = await this.request.post(`${BASE_URL}/pet`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            data: petData,
        });

        return response;
    }

    // Get a pet by ID
    async getPet(petId: number) {
    const response = await this.request.get(`${BASE_URL}/pet/${petId}`);
    return response;
    }

    // Delete a pet by ID
    async deletePet(petId: number) {
        const response = await this.request.delete(`${BASE_URL}/pet/${petId}`, {
            headers: {
                'Accept': 'application/json',
                'api_key': process.env.PETSTORE_API_KEY || ''
            }
        });

        return response;
    }

    //Todo
    async updatePet(){
        // Implementation for updating a pet will go here
        // This is a placeholder function and should be implemented as needed
        throw new Error("Method not implemented.");
    }            
    
    //Todo
    async uploadPetImage() {
        // Implementation for uploading a pet image will go here
        // This is a placeholder function and should be implemented as needed
        throw new Error("Method not implemented.");
    }

    //Todo
    async findPetsByStatus() {
        // Implementation for finding pets by status will go here
        // This is a placeholder function and should be implemented as needed
        throw new Error("Method not implemented.");
    }
}
