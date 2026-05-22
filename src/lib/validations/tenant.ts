import * as z from "zod";

export const tenantProfileSchema = z.object({
    firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères."),
    lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
    phone: z.string().regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, "Numéro de téléphone invalide (format français)."),
    situation: z.enum(["CDI", "CDD", "STUDENT", "FREELANCE", "RETIRED", "UNEMPLOYED"] as const),
    monthlyIncome: z.coerce.number().min(0, "Le revenu doit être positif."),
    guarantorType: z.enum(["NONE", "PHYSICAL", "VISALE", "OTHER"] as const),
});

export type TenantProfileValues = z.infer<typeof tenantProfileSchema>;
