// src/types/meuble.ts

export interface ImageMeubleDto {
  id?: number;
  url: string;
  ordreAffichage: number;
  estPrincipale: boolean;
}

export interface DimensionsMeubleDto {
  hauteur: number;
  largeur: number;
  profondeur: number;
}

export interface CaracteristiquesTechniquesMeubleDto {
  compositionType: string;
  caisson: string;
  facade: string;
}

export interface CouleurMeubleDto {
  id: number;
  nom: string;
  CodeCouleur: string; 
  imagePresentationUrl : string;
}

export interface MeubleDto {
  id: string;
  categorie: string;
  forme: string;
  nom: string;
  prixInitial: number;
  reduction: number;
  description: string;
  dimensions: DimensionsMeubleDto;
  images: ImageMeubleDto[];
  caracteristiquesTechniques: CaracteristiquesTechniquesMeubleDto;
  couleurs: CouleurMeubleDto[];
}

export interface CreateMeublePayload {
  categorie: string;
  forme: string;
  nom: string;
  prixInitial: number;
  reduction: number;
  description: string;
  hauteur: number;
  largeur: number;
  profondeur: number;
  compositionType: string;
  caisson: string;
  facade: string;
  couleurIds?: number[];
  files: File[];
}

export interface UpdateMeublePayload {
  categorie: string;
  forme: string;
  nom: string;
  prixInitial: number;
  reduction: number;
  description: string;
  hauteur: number;
  largeur: number;
  profondeur: number;
  compositionType: string;
  caisson: string;
  facade: string;
  couleurIds?: number[];
  images?: File[];
}