// src/types/dressing.ts

export interface ImageDressingDto {
  id?: number;
  url: string;
  ordreAffichage: number;
  estPrincipale: boolean;
}

export interface DimensionsDressingDto {
  hauteur: number;
  largeur: number;
  profondeur: number;
}

export interface CaracteristiquesTechniquesDressingDto {
  compositionType: string;
  caisson: string;
  facade: string;
}

export interface CouleurDressingDto {
  id: number;
  nom: string;
  CodeCouleur: string; 
  imagePresentationUrl : string;
}

export interface DressingDto {
  id: string;
  categorie: string;
  forme: string;
  typeOuverture: string;
  nom: string;
  prixInitial: number;
  reduction: number;
  description: string;
  dimensions: DimensionsDressingDto;
  images: ImageDressingDto[];
  caracteristiquesTechniques: CaracteristiquesTechniquesDressingDto;
  couleurs: CouleurDressingDto[];
}