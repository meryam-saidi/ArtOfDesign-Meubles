// src/types/couleur.ts

export interface CouleurDto {
  id: number;
  nom: string;
  codeCouleur: string;
  imagePresentationUrl: string;
}

export interface CreateCouleurPayload {
  nom: string;
  codeCouleur: string;
  image: File;
}

export interface UpdateCouleurPayload {
  nom: string;
  codeCouleur: string;
  image?: File | null;
}