import { test, expect } from '@playwright/test';
import { getPetSchema } from '../../schemas/getPet.schema';
import { wrongGetPetSchema } from '../../schemas/wrongGetPet.schema';
import { PetClient } from '../../API-clients/petClient';
import { faker } from '@faker-js/faker'
import existingPet from '../../test-data/existingPet.json';
import nonExistentPet from '../../test-data/nonExistentPet.json';

test.describe('CREATE Pet Tests', () => {
    test('Create a new pet', async ({ request }) => {
        // Create a new instance of the PetClient
        const petClient = new PetClient(request);

        const petData = {
            id: faker.number.int({ min: 4000, max: 50000 }),
            category: { 
                id: 1,
                name: 'Dog'
            },
            name: faker.animal.dog(),
            photoUrls: [],
            tags: [],
            status: 'Healthy'
        };

        // Create a new pet using the Pet Client
        const createPetResponse = await petClient.createPet(petData);

        // Check if the response status is 200 OK
        expect(createPetResponse.status()).toBe(200);

        // Parse the response body
        const createPetResponseBody = await createPetResponse.json();

        // Validate the reponse
        expect(createPetResponseBody.id).toBe(petData.id);
        expect(createPetResponseBody.name).toBe(petData.name);
        expect(createPetResponseBody.status).toBe(petData.status);
    });

    // This test seems to have found an issue, as it's expecting a 405 Invalid Input status code, but the API returns a 500!
    test('Negative Case - Create an invalid ID', async ({ request }) => {
        // Create a new instance of the PetClient
        const petClient = new PetClient(request);

        // Create a pet with an invalid ID (string instead of number)
        const incompletePetData = {
            id: "Test",
            category: { 
                id: 1,
                name: 'Dog'
            },
            // Missing name field
            photoUrls: [],
            tags: [],
            status: 'Healthy'
        };

        // Attempt to create a new pet using the Pet Client
        const createPetResponse = await petClient.createPetWithInvalidData(incompletePetData);

        // Check if the response status is 405 Invalid Input
        expect(createPetResponse.status()).toBe(405);
    });

});

test.describe('GET Pet Tests', () => {
    test('Get a existing pet', async ({ request }) => {
        // Create a new instance of the PetClient
        const petClient = new PetClient(request);

        // Get the existing pet using the Pet Client
        const getPetResponse = await petClient.getPet(existingPet.id);

        // Check if the response status is 200 OK
        expect(getPetResponse.status()).toBe(200);

        // Parse the response body
        const getPetResponseBody = await getPetResponse.json();

        // Validate the response body against the schema
        const schemaValidation = getPetSchema.safeParse(getPetResponseBody);
        expect(schemaValidation.success).toBe(true);

        // Validate the Pet name
        expect(getPetResponseBody.name).toBe(existingPet.name);
    })

    // This test is expected to fail due to schema validation error (missing the id field in the schema).
    test('Negative Case - Schema validation error', async ({ request }) => {
        // Create a new instance of the PetClient
        const petClient = new PetClient(request);
        
        // Get the existing pet using the API client
        const getPetResponse = await petClient.getPet(existingPet.id);

        // Check if the response status is 200 OK
        expect(getPetResponse.status()).toBe(200);

        // Parse the response body
        const getPetResponseBody = await getPetResponse.json();
        
        // Validate the response body against the schema
        const schemaValidation = wrongGetPetSchema.safeParse(getPetResponseBody);
        if (!schemaValidation.success) {
            // Log a detailed error
            console.error('❌ Schema validation failed:');
            console.error(JSON.stringify(schemaValidation.error.format(), null, 2));
        }
        expect(schemaValidation.success).toBe(true);
    })

    test('Negative Case - Get an unexisting pet', async ({ request }) => {
        // Create a new instance of the PetClient
        const petClient = new PetClient(request);
        
        // Get the existing pet using the API client
        const getPetResponse = await petClient.getPet(25875);

        // Check if the response status is 404 OK
        expect(getPetResponse.status()).toBe(404);

        // Parse the response body
        const getPetResponseBody = await getPetResponse.json();

        // Validate the error message
        expect(getPetResponseBody.message).toBe('Pet not found');
    })
});

test.describe('DELETE Pet Tests', () => {
    test('Create and delete a pet', async ({ request }) => {
        // Create a new instance of the PetClient
        const petClient = new PetClient(request);

        const petData = {
            id: faker.number.int({ min: 4000, max: 50000 }),
            category: { 
                id: 1,
                name: 'Dog'
            },
            name: faker.animal.dog(),
            photoUrls: [],
            tags: [],
            status: 'Healthy'
        };

        // Create a new pet using the Pet Client
        const createPetResponse = await petClient.createPet(petData);

        // Check if the response status is 200 OK
        expect(createPetResponse.status()).toBe(200);

        // Parse the response body
        const createPetResponseBody = await createPetResponse.json();

        // It seems to be an issue with the API where the deletion of a recently created pet fails if the request is sent immediately after creation.
        // To avoid this, and purely for this example purposes and acknowledging this is not a good practice at all, we will wait for 6 seconds before sending the delete request.
        await new Promise(r => setTimeout(r, 6000));

        // Delete the created pet
        const deletePetResponse = await petClient.deletePet(petData.id);

        // Parse the response body
        const deletePetResponseBody = await deletePetResponse.json();
        
        // Check the response 
        expect(deletePetResponse.status()).toBe(200);
        expect(deletePetResponseBody.message).toBe(petData.id.toString());
    });

    test('Delete a non-existent dog ', async ({ request }) => {
        // Create a new instance of the PetClient
        const petClient = new PetClient(request);

        // Delete the created pet
        const deletePetResponse = await petClient.deletePet(nonExistentPet.id);
        
        // Check the response 
        expect(deletePetResponse.status()).toBe(404);
        expect(deletePetResponse.statusText()).toBe('Not Found');
    });

});