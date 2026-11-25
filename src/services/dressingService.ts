// src/services/dressingService.ts
import type {
  DressingDto,
  CreateDressingPayload,
  UpdateDressingPayload,
} from '../types/dressing';

const API_BASE_URL = (
  import.meta.env.PUBLIC_API_URL
).replace(/\/$/, '');

const DRESSINGS_ENDPOINT = `${API_BASE_URL}/dressings`;

async function extractErrorMessage(response: Response, fallbackMessage: string): Promise<string> {
  try {
    const data = await response.json();
    if (data?.message) return String(data.message);
  } catch {
    // Réponse vide ou non JSON
  }
  return `${fallbackMessage} (HTTP ${response.status})`;
}

/**
 * Récupère tous les dressings depuis l'API backend.
 */
export async function getDressings(): Promise<DressingDto[]> {
  try {
    const response = await fetch(DRESSINGS_ENDPOINT, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status} lors de la récupération des dressings`);
    }

    return (await response.json()) as DressingDto[];
  } catch (error) {
    console.error('[dressingService] Impossible de charger les dressings :', error);
    return [];
  }
}

/**
 * Récupère un dressing spécifique par son ID depuis l'API backend.
 */
export async function getDressingById(id: string): Promise<DressingDto | null> {
  if (!id) return null;

  try {
    const response = await fetch(`${DRESSINGS_ENDPOINT}/${encodeURIComponent(id)}`, {
      headers: { Accept: 'application/json' },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status} pour le dressing ${id}`);
    }

    return (await response.json()) as DressingDto;
  } catch (error) {
    console.error(`[dressingService] Impossible de charger le dressing "${id}" :`, error);
    return null;
  }
}

/**
 * Crée un dressing en multipart/form-data.
 */
export async function createDressing(payload: CreateDressingPayload): Promise<DressingDto> {
  if (!payload.files || payload.files.length === 0) {
    throw new Error('Ajoute au moins une image.');
  }

  const formData = new FormData();

  formData.append('Categorie', payload.categorie);
  formData.append('Forme', payload.forme);
  formData.append('TypeOuverture', payload.typeOuverture ?? '');
  formData.append('Nom', payload.nom);
  formData.append('PrixInitial', String(payload.prixInitial));
  formData.append('Reduction', String(payload.reduction));
  formData.append('Description', payload.description ?? '');

  formData.append('Hauteur', String(payload.hauteur));
  formData.append('Largeur', String(payload.largeur));
  formData.append('Profondeur', String(payload.profondeur));

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

  const response = await fetch(DRESSINGS_ENDPOINT, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const message = await extractErrorMessage(response, 'Échec de la création du dressing');
    throw new Error(message);
  }

  return (await response.json()) as DressingDto;
}

/**
 * Met à jour un dressing existant en multipart/form-data.
 */
export async function updateDressing(
  id: string,
  payload: UpdateDressingPayload
): Promise<DressingDto> {
  if (!id) {
    throw new Error('Identifiant de dressing manquant.');
  }

  const formData = new FormData();

  formData.append('Categorie', payload.categorie);
  formData.append('Forme', payload.forme);
  formData.append('TypeOuverture', payload.typeOuverture ?? '');
  formData.append('Nom', payload.nom);
  formData.append('PrixInitial', String(payload.prixInitial));
  formData.append('Reduction', String(payload.reduction));
  formData.append('Description', payload.description ?? '');

  formData.append('Hauteur', String(payload.hauteur));
  formData.append('Largeur', String(payload.largeur));
  formData.append('Profondeur', String(payload.profondeur));

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

  const response = await fetch(`${DRESSINGS_ENDPOINT}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    const message = await extractErrorMessage(
      response,
      `Échec de la mise à jour du dressing "${id}"`
    );
    throw new Error(message);
  }

  return (await response.json()) as DressingDto;
}

/**
 * Supprime une image d'un dressing : DELETE /api/dressings/{id}/images/{imageId}
 */
export async function deleteDressingImage(id: string, imageId: number): Promise<void> {
  if (!id) {
    throw new Error('Identifiant de dressing manquant.');
  }

  const response = await fetch(
    `${DRESSINGS_ENDPOINT}/${encodeURIComponent(id)}/images/${encodeURIComponent(String(imageId))}`,
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
 * Supprime un dressing : DELETE /api/dressings/{id}
 */
export async function deleteDressing(id: string): Promise<void> {
  if (!id) {
    throw new Error('Identifiant de dressing manquant.');
  }

  const response = await fetch(`${DRESSINGS_ENDPOINT}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const message = await extractErrorMessage(
      response,
      `Échec de la suppression du dressing "${id}"`
    );
    throw new Error(message);
  }
}