import * as z from "zod";

export const listingSchema = z.object({
    title: z.string().min(10, "Le titre doit faire au moins 10 caractères."),
    description: z.string().min(30, "La description doit faire au moins 30 caractères."),
    rentAmount: z.coerce.number().min(100, "Le loyer doit être supérieur à 0."),
    address: z.string().min(5, "L'adresse est requise."),
    surface: z.coerce.number().min(9, "La surface doit être d'au moins 9m²."),
    rooms: z.coerce.number().min(1, "Au moins 1 pièce."),
});

export type ListingValues = z.infer<typeof listingSchema>;
