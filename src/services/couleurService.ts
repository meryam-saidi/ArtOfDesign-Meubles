// src/services/couleurService.ts
import type {
  CouleurDto,
  CreateCouleurPayload,
  UpdateCouleurPayload,
} from '../types/couleur';

const API_BASE_URL = (
  import.meta.env.PUBLIC_API_URL
).replace(/\/$/, '');

const COULEURS_ENDPOINT = `${API_BASE_URL}/couleurs`;

async function extractErrorMessage(response: Response, fallbackMessage: string): Promise<string> {
  try {
    const data = await response.json();
    if (data?.message) return String(data.message);
  } catch {
    // Réponse vide ou non JSON (ex. 404 / 204)
  }
  return `${fallbackMessage} (HTTP ${response.status})`;
}

/**
 * Récupère toutes les couleurs : GET /api/couleurs
 */
export async function getCouleurs(): Promise<CouleurDto[]> {
  try {
    const response = await fetch(COULEURS_ENDPOINT, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status} lors de la récupération des couleurs`);
    }

    return (await response.json()) as CouleurDto[];
  } catch (error) {
    console.error('[couleurService] Impossible de charger les couleurs :', error);
    return [];
  }
}

/**
 * Récupère une couleur par son ID : GET /api/couleurs/{id}
 */
export async function getCouleurById(id: number): Promise<CouleurDto | null> {
  if (!id) return null;

  try {
    const response = await fetch(`${COULEURS_ENDPOINT}/${encodeURIComponent(String(id))}`, {
      headers: { Accept: 'application/json' },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status} pour la couleur #${id}`);
    }

    return (await response.json()) as CouleurDto;
  } catch (error) {
    console.error(`[couleurService] Impossible de charger la couleur #${id} :`, error);
    return null;
  }
}

/**
 * Crée une couleur : POST /api/couleurs ([FromForm] CreateCouleurForm)
 * Le champ fichier s'appelle "Image" conformément à form.Image côté .NET.
 */
export async function createCouleur(payload: CreateCouleurPayload): Promise<CouleurDto> {
  if (!payload.image || payload.image.size === 0) {
    throw new Error('Une image est obligatoire.');
  }

  const formData = new FormData();
  formData.append('Nom', payload.nom.trim());
  formData.append('CodeCouleur', payload.codeCouleur.trim());
  formData.append('Image', payload.image, payload.image.name);

  const response = await fetch(COULEURS_ENDPOINT, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const message = await extractErrorMessage(response, 'Échec de la création de la couleur');
    throw new Error(message);
  }

  return (await response.json()) as CouleurDto;
}

/**
 * Met à jour une couleur : PUT /api/couleurs/{id} ([FromForm] UpdateCouleurForm)
 * Le champ fichier "Image" est optionnel.
 */
export async function updateCouleur(
  id: number,
  payload: UpdateCouleurPayload
): Promise<CouleurDto> {
  if (!id) {
    throw new Error('Identifiant de couleur invalide.');
  }

  const formData = new FormData();
  formData.append('Nom', payload.nom.trim());
  formData.append('CodeCouleur', payload.codeCouleur.trim());

  if (payload.image && payload.image.size > 0) {
    formData.append('Image', payload.image, payload.image.name);
  }

  const response = await fetch(`${COULEURS_ENDPOINT}/${encodeURIComponent(String(id))}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    const message = await extractErrorMessage(
      response,
      `Échec de la mise à jour de la couleur #${id}`
    );
    throw new Error(message);
  }

  return (await response.json()) as CouleurDto;
}

/**
 * Supprime une couleur : DELETE /api/couleurs/{id}
 */
export async function deleteCouleur(id: number): Promise<void> {
  if (!id) {
    throw new Error('Identifiant de couleur invalide.');
  }

  const response = await fetch(`${COULEURS_ENDPOINT}/${encodeURIComponent(String(id))}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const message = await extractErrorMessage(
      response,
      `Échec de la suppression de la couleur #${id}`
    );
    throw new Error(message);
  }
}