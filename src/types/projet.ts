export interface ImageProjet {
  id: number;
  title: string;
  url: string;
  est3D: boolean;
  ordreAffichage: number;
  estPrincipale: boolean;
}

export interface Projet {
  id: string;
  categorie: string;
  nom: string;
  description: string;
  images: ImageProjet[];
}

// Données du formulaire admin (création / modification)
export interface ProjetFormData {
  nom: string;
  description: string;
  images3D: File[];
  imagesReelles: File[];
}