import { z } from 'zod';

export const wrongGetPetSchema = z.object({
    //The id is commented out to fail the test in purpose.
    //id: z.number(),
    name: z.string(),
    photoUrls: z.array(z.string()).optional(), // Optional, and can be empty
    tags: z.array(
        z.object({
        id: z.number(),
        name: z.string()
        })
    ).optional(), // Optional, and can be empty
    category: z
        .object({
        id: z.number(),
        name: z.string()
        })
        .optional(), // Optional field

    // Status can be any string if not constrained by enum in practice
    status: z.string()
}).strict();