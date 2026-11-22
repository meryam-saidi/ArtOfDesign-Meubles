// src/services/meubleService.ts
import meublesData from '../data/meuble.json'; // Import de ton JSON local pour le fallback
import type { MeubleDto } from '../types/meuble';

const USE_API = true; // Passe à true uniquement quand tu veux tester ton API .NET

// Récupérer tous les Meubles (Typé avec Promise<MeubleDto[]>)
export async function getMeubles(): Promise<MeubleDto[]> {
    if (USE_API) {
        try {
            const response = await fetch('http://localhost:5133/api/meubles'); 
            if (!response.ok) throw new Error('Erreur réseau lors de la récupération des meubles');
            return await response.json();
        } catch (error) {
            console.error("Impossible de joindre l'API, bascule sur le cache local :", error);
            return getLocalMeublesFallback();
        }
    } else {
        return getLocalMeublesFallback();
    }
}

// Fallback pour la liste entière
function getLocalMeublesFallback(): MeubleDto[] {
    // On caste le JSON local en MeubleDto[] si nécessaire
    return meublesData as unknown as MeubleDto[];
}

// Récupérer un seul meuble par son ID (Typé avec Promise<MeubleDto | null>)
export async function getMeubleById(id: string): Promise<MeubleDto | null> {
    if (USE_API) {
        try {
            const response = await fetch(`http://localhost:5133/api/meubles/${id}`); 
            if (!response.ok) throw new Error('Erreur réseau lors de la récupération du meuble');
            return await response.json();
        } catch (error) {
            console.error("Impossible de joindre l'API, bascule sur le cache local :", error);
            return getLocalMeubleByIdFallback(id);
        }
    } else {
        return getLocalMeubleByIdFallback(id);
    }
}

// Fallback pour un seul élément par ID
function getLocalMeubleByIdFallback(id: string): MeubleDto | null {
    const allMeubles = meublesData as unknown as MeubleDto[];
    const found = allMeubles.find(m => m.id.toString().toLowerCase() === id.toLowerCase());
    return found || null;
}