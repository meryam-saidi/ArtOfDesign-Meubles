// src/services/meubleService.ts
import type {
  MeubleDto,
  CreateMeublePayload,
  UpdateMeublePayload,
} from '../types/meuble';

const API_BASE_URL = (
  import.meta.env.PUBLIC_API_URL
).replace(/\/$/, '');

const MEUBLES_ENDPOINT = `${API_BASE_URL}/meubles`;

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
 * Récupère tous les meubles depuis l'API backend.
 */
export async function getMeubles(): Promise<MeubleDto[]> {
  try {
    const response = await fetch(MEUBLES_ENDPOINT, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status} lors de la récupération des meubles`);
    }

    return (await response.json()) as MeubleDto[];
  } catch (error) {
    console.error('[meubleService] Impossible de charger les meubles :', error);
    return [];
  }
}

/**
 * Récupère un meuble spécifique par son ID depuis l'API backend.
 */
export async function getMeubleById(id: string): Promise<MeubleDto | null> {
  if (!id) return null;

  try {
    const response = await fetch(`${MEUBLES_ENDPOINT}/${encodeURIComponent(id)}`, {
      headers: { Accept: 'application/json' },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status} pour le meuble ${id}`);
    }

    return (await response.json()) as MeubleDto;
  } catch (error) {
    console.error(`[meubleService] Impossible de charger le meuble "${id}" :`, error);
    return null;
  }
}

/**
 * Crée un meuble en multipart/form-data.
 */
export async function createMeuble(payload: CreateMeublePayload): Promise<MeubleDto> {
  if (!payload.files || payload.files.length === 0) {
    throw new Error('Ajoute au moins une image.');
  }

  const formData = new FormData();

  formData.append('Categorie', payload.categorie);
  formData.append('Forme', payload.forme ?? '');
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

  const response = await fetch(MEUBLES_ENDPOINT, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const message = await extractErrorMessage(response, 'Échec de la création du meuble');
    throw new Error(message);
  }

  return (await response.json()) as MeubleDto;
}

/**
 * Met à jour un meuble existant en multipart/form-data.
 */
export async function updateMeuble(
  id: string,
  payload: UpdateMeublePayload
): Promise<MeubleDto> {
  if (!id) {
    throw new Error('Identifiant de meuble manquant.');
  }

  const formData = new FormData();

  formData.append('Categorie', payload.categorie);
  formData.append('Forme', payload.forme ?? '');
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

  const response = await fetch(`${MEUBLES_ENDPOINT}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    const message = await extractErrorMessage(
      response,
      `Échec de la mise à jour du meuble "${id}"`
    );
    throw new Error(message);
  }

  return (await response.json()) as MeubleDto;
}

/**
 * Supprime une image d'un meuble : DELETE /api/meubles/{id}/images/{imageId}
 */
export async function deleteMeubleImage(id: string, imageId: number): Promise<void> {
  if (!id) {
    throw new Error('Identifiant de meuble manquant.');
  }

  const response = await fetch(
    `${MEUBLES_ENDPOINT}/${encodeURIComponent(id)}/images/${encodeURIComponent(String(imageId))}`,
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
 * Supprime un meuble : DELETE /api/meubles/{id}
 */
export async function deleteMeuble(id: string): Promise<void> {
  if (!id) {
    throw new Error('Identifiant de meuble manquant.');
  }

  const response = await fetch(`${MEUBLES_ENDPOINT}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const message = await extractErrorMessage(
      response,
      `Échec de la suppression du meuble "${id}"`
    );
    throw new Error(message);
  }
}