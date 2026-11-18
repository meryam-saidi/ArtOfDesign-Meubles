// src/services/cuisineService.ts
import type { CuisineDto } from '../types/cuisine';
import cuisinesData from '../data/cuisines.json'; // Ton ancien JSON local de secours

const USE_API = true; // Passe à true pour tester ton API .NET

// Récupérer toutes les cuisines
export async function getCuisines(): Promise<CuisineDto[]> {
    if (USE_API) {
        try {
            const response = await fetch('http://localhost:5133/api/cuisines'); 
            if (!response.ok) throw new Error('Erreur réseau lors de la récupération des cuisines');
            return await response.json();
        } catch (error) {
            console.error("Impossible de joindre l'API cuisines, bascule sur le cache local :", error);
            return cuisinesData as unknown as CuisineDto[];
        }
    } else {
        return cuisinesData as unknown as CuisineDto[];
    }
}

// Récupérer une seule cuisine par son ID (pour la page de détails)
export async function getCuisineById(id: string): Promise<CuisineDto | null> {
    if (USE_API) {
        try {
            const response = await fetch(`http://localhost:5133/api/cuisines/${id}`); 
            if (!response.ok) throw new Error(`Cuisine ${id} introuvable sur l'API`);
            return await response.json();
        } catch (error) {
            console.error("Impossible de joindre l'API pour cette cuisine, bascule sur le cache local :", error);
            return getLocalCuisineByIdFallback(id);
        }
    } else {
        return getLocalCuisineByIdFallback(id);
    }
}

function getLocalCuisineByIdFallback(id: string): CuisineDto | null {
    const allCuisines = cuisinesData as unknown as CuisineDto[];
    const found = allCuisines.find(c => c.id.toString().toLowerCase() === id.toLowerCase());
    return found || null;
}