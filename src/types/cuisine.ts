// src/types/cuisine.ts

export interface ImageCuisineDto {
  id: number;
  url: string;
  ordreAffichage: number;
  estPrincipale: boolean;
}

export interface DimensionsCuisineDto {
  hauteurCaissonBas: number;
  profondeurCaissonBas: number;
  hauteurCaissonHaut: number;
  profondeurCaissonHaut: number;
}

export interface CaracteristiquesTechniquesCuisineDto {
  compositionType: string;
  caisson: string;
  facade: string;
}

export interface CouleurCuisineDto {
  id: number;
  nom: string;
  codeCouleur: string;
  imagePresentationUrl: string;
}

export interface CuisineDto {
  id: string; // ou number selon ton type d'ID en base
  categorie: string;
  forme: string;
  nom: string;
  prixInitial: number;
  reduction: number;
  description: string;
  nb: string;
  dimensions: DimensionsCuisineDto;
  images: ImageCuisineDto[];
  caracteristiquesTechniques: CaracteristiquesTechniquesCuisineDto;
  couleurs: CouleurCuisineDto[];
}