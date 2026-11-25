// src/services/cuisineService.ts
import type {
  CuisineDto,
  CreateCuisinePayload,
  UpdateCuisinePayload,
} from '../types/cuisine';

const API_BASE_URL = (
  import.meta.env.PUBLIC_API_URL
).replace(/\/$/, '');

const CUISINES_ENDPOINT = `${API_BASE_URL}/cuisines`;

async function extractErrorMessage(response: Response, fallbackMessage: string): Promise<string> {
  try {
    const data = await response.json();
    if (data?.message) return String(data.message);
  } catch {
    // Réponse non JSON ou vide
  }
  return `${fallbackMessage} (HTTP ${response.status})`;
}

/**
 * Récupère toutes les cuisines depuis l'API.
 */
export async function getCuisines(): Promise<CuisineDto[]> {
  try {
    const response = await fetch(CUISINES_ENDPOINT, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status} lors de la récupération des cuisines`);
    }

    return (await response.json()) as CuisineDto[];
  } catch (error) {
    console.error('[cuisineService] Impossible de charger les cuisines :', error);
    return [];
  }
}

/**
 * Récupère une cuisine par son ID.
 */
export async function getCuisineById(id: string): Promise<CuisineDto | null> {
  if (!id) return null;

  try {
    const response = await fetch(`${CUISINES_ENDPOINT}/${encodeURIComponent(id)}`, {
      headers: { Accept: 'application/json' },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status} pour la cuisine ${id}`);
    }

    return (await response.json()) as CuisineDto;
  } catch (error) {
    console.error(`[cuisineService] Impossible de charger la cuisine "${id}" :`, error);
    return null;
  }
}

/**
 * Crée une cuisine en multipart/form-data ([FromForm] CreateCuisineDto + [FromForm] List<IFormFile> files).
 */
export async function createCuisine(payload: CreateCuisinePayload): Promise<CuisineDto> {
  if (!payload.files || payload.files.length === 0) {
    throw new Error('Ajoute au moins une image.');
  }

  const formData = new FormData();

  formData.append('Categorie', payload.categorie);
  formData.append('Forme', payload.forme);
  formData.append('Nom', payload.nom);
  formData.append('PrixInitial', String(payload.prixInitial));
  formData.append('Reduction', String(payload.reduction));
  formData.append('Description', payload.description ?? '');
  formData.append('Nb', payload.nb ?? '');

  formData.append('HauteurCaissonBas', String(payload.hauteurCaissonBas));
  formData.append('ProfondeurCaissonBas', String(payload.profondeurCaissonBas));
  formData.append('HauteurCaissonHaut', String(payload.hauteurCaissonHaut));
  formData.append('ProfondeurCaissonHaut', String(payload.profondeurCaissonHaut));

  formData.append('CompositionType', payload.compositionType ?? '');
  formData.append('Caisson', payload.caisson ?? '');
  formData.append('Facade', payload.facade ?? '');

  if (payload.couleurIds && payload.couleurIds.length > 0) {
    for (const couleurId of payload.couleurIds) {
      formData.append('CouleurIds', String(couleurId));
    }
  }

  for (const file of payload.files) {
    formData.append('files', file, file.name);
  }

  // Ne pas définir manuellement Content-Type : le navigateur ajoute le boundary multipart automatiquement
  const response = await fetch(CUISINES_ENDPOINT, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const message = await extractErrorMessage(response, 'Échec de la création de la cuisine');
    throw new Error(message);
  }

  return (await response.json()) as CuisineDto;
}

/**
 * Met à jour une cuisine existante en multipart/form-data ([FromForm] UpdateCuisineForm).
 */
export async function updateCuisine(
  id: string,
  payload: UpdateCuisinePayload
): Promise<CuisineDto> {
  if (!id) {
    throw new Error('Identifiant de cuisine manquant.');
  }

  const formData = new FormData();

  formData.append('Categorie', payload.categorie);
  formData.append('Forme', payload.forme);
  formData.append('Nom', payload.nom);
  formData.append('PrixInitial', String(payload.prixInitial));
  formData.append('Reduction', String(payload.reduction));
  formData.append('Description', payload.description ?? '');
  formData.append('Nb', payload.nb ?? '');

  formData.append('HauteurCaissonBas', String(payload.hauteurCaissonBas));
  formData.append('ProfondeurCaissonBas', String(payload.profondeurCaissonBas));
  formData.append('HauteurCaissonHaut', String(payload.hauteurCaissonHaut));
  formData.append('ProfondeurCaissonHaut', String(payload.profondeurCaissonHaut));

  formData.append('CompositionType', payload.compositionType ?? '');
  formData.append('Caisson', payload.caisson ?? '');
  formData.append('Facade', payload.facade ?? '');

  if (payload.couleurIds && payload.couleurIds.length > 0) {
    for (const couleurId of payload.couleurIds) {
      formData.append('CouleurIds', String(couleurId));
    }
  }

  if (payload.images && payload.images.length > 0) {
    for (const file of payload.images) {
      formData.append('Images', file, file.name);
    }
  }

  const response = await fetch(`${CUISINES_ENDPOINT}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    const message = await extractErrorMessage(
      response,
      `Échec de la mise à jour de la cuisine "${id}"`
    );
    throw new Error(message);
  }

  return (await response.json()) as CuisineDto;
}

/**
 * Supprime une image d'une cuisine : DELETE /api/cuisines/{id}/images/{imageId}
 */
export async function deleteCuisineImage(id: string, imageId: number): Promise<void> {
  if (!id) {
    throw new Error('Identifiant de cuisine manquant.');
  }

  const response = await fetch(
    `${CUISINES_ENDPOINT}/${encodeURIComponent(id)}/images/${encodeURIComponent(String(imageId))}`,
    {
      method: 'DELETE',
    }
  );

  if (!response.ok) {
    const message = await extractErrorMessage(
      response,
      `Échec de la suppression de l'image ${imageId}`
    );
    throw new Error(message);
  }
}

/**
 * Supprime une cuisine : DELETE /api/cuisines/{id}
 */
export async function deleteCuisine(id: string): Promise<void> {
  if (!id) {
    throw new Error('Identifiant de cuisine manquant.');
  }

  const response = await fetch(`${CUISINES_ENDPOINT}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const message = await extractErrorMessage(
      response,
      `Échec de la suppression de la cuisine "${id}"`
    );
    throw new Error(message);
  }
}