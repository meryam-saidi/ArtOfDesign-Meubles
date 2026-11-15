// src/services/dressingService.js

const USE_API = true; // Passe à true uniquement quand tu veux tester ton API .NET

export async function getDressings() {
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
        // Ton ancien fichier JSON statique importé ou simulé
        return getLocalDressingsFallback();
    }
}

function getLocalDressingsFallback() {
    // Retourne tes données JSON actuelles pour sécuriser le site vitrine
    return [
        // ... tes données statiques habituelles
    ];
}

export async function getDressingById(id) {
    if (USE_API) {
        try {
            const response = await fetch(`http://localhost:5133/api/dressings/${id}`); 
            if (!response.ok) throw new Error('Erreur réseau lors de la récupération du dressing');
            return await response.json();
        } catch (error) {
            console.error("Impossible de joindre l'API, bascule sur le cache local :", error);
            return getLocalDressingByIdFallback(id); // On appelle une fonction dédiée pour un seul élément
        }
    } else {
        // En mode local, on cherche le dressing spécifique par son ID dans le JSON
        return getLocalDressingByIdFallback(id);
    }
}