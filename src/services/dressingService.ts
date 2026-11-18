// src/services/dressingService.ts
import type { DressingDto } from '../types/dressing';
import dressingsData from '../data/dressing.json'; // Import de ton JSON local pour le fallback

const USE_API = true; // Passe à true uniquement quand tu veux tester ton API .NET

// Récupérer tous les dressings (Typé avec Promise<DressingDto[]>)
export async function getDressings(): Promise<DressingDto[]> {
    if (USE_API) {
        try {
            const response = await fetch('http://localhost:5133/api/dressings'); 
            if (!response.ok) throw new Error('Erreur réseau lors de la récupération des dressings');
            return await response.json();
        } catch (error) {
            console.error("Impossible de joindre l'API, bascule sur le cache local :", error);
            return getLocalDressingsFallback();
        }
    } else {
        return getLocalDressingsFallback();
    }
}

// Fallback pour la liste entière
function getLocalDressingsFallback(): DressingDto[] {
    // On caste le JSON local en DressingDto[] si nécessaire
    return dressingsData as unknown as DressingDto[];
}

// Récupérer un seul dressing par son ID (Typé avec Promise<DressingDto | null>)
export async function getDressingById(id: string): Promise<DressingDto | null> {
    if (USE_API) {
        try {
            const response = await fetch(`http://localhost:5133/api/dressings/${id}`); 
            if (!response.ok) throw new Error('Erreur réseau lors de la récupération du dressing');
            return await response.json();
        } catch (error) {
            console.error("Impossible de joindre l'API, bascule sur le cache local :", error);
            return getLocalDressingByIdFallback(id);
        }
    } else {
        return getLocalDressingByIdFallback(id);
    }
}

// Fallback pour un seul élément par ID
function getLocalDressingByIdFallback(id: string): DressingDto | null {
    const allDressings = dressingsData as unknown as DressingDto[];
    const found = allDressings.find(d => d.id.toString().toLowerCase() === id.toLowerCase());
    return found || null;
}