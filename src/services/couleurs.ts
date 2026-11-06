
const API_URL = import.meta.env.PUBLIC_API_URL;

export interface Couleur {
  id: number;
  nom: string;
  codeCouleur: string;
  imagePresentationUrl: string;
}

export async function getCouleurs(): Promise<Couleur[]> {
  const response = await fetch(`${API_URL}/api/Couleurs`);

  if (!response.ok) {
    throw new Error(`Erreur lors du chargement des couleurs : ${response.status}`);
  }

  return response.json();
}
