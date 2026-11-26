import type { Projet, ImageProjet, ProjetFormData } from "../types/projet";

const API_URL = `${import.meta.env.PUBLIC_API_URL}/projets`;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Erreur ${res.status}`);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

function toFormData(data: ProjetFormData): FormData {
  const fd = new FormData();
  fd.append("Nom", data.nom);
  fd.append("Description", data.description);
  data.images3D.forEach((f) => fd.append("Images3D", f));
  data.imagesReelles.forEach((f) => fd.append("ImagesReelles", f));
  return fd;
}

// ---------- Lecture (site public) ----------

export async function getProjets(): Promise<Projet[]> {
  return handleResponse(await fetch(API_URL));
}

export async function getProjetById(id: string): Promise<Projet | null> {
  const res = await fetch(`${API_URL}/${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  return handleResponse(res);
}

// ---------- Écriture (panel admin) ----------
// Ne pas définir Content-Type : le navigateur ajoute le boundary multipart lui-même.

export async function createProjet(data: ProjetFormData): Promise<Projet> {
  return handleResponse(
    await fetch(API_URL, { method: "POST", body: toFormData(data) })
  );
}

export async function updateProjet(id: string, data: ProjetFormData): Promise<Projet> {
  return handleResponse(
    await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: toFormData(data),
    })
  );
}

export async function deleteProjet(id: string): Promise<void> {
  return handleResponse(
    await fetch(`${API_URL}/${encodeURIComponent(id)}`, { method: "DELETE" })
  );
}

export async function deleteImageProjet(projetId: string, imageId: number): Promise<void> {
  return handleResponse(
    await fetch(`${API_URL}/${encodeURIComponent(projetId)}/images/${imageId}`, {
      method: "DELETE",
    })
  );
}

// ---------- Helpers d'affichage ----------

export const getImages3D = (p: Projet): ImageProjet[] => p.images.filter((i) => i.est3D);
export const getImagesReelles = (p: Projet): ImageProjet[] => p.images.filter((i) => !i.est3D);
export const getImagePrincipale = (p: Projet): ImageProjet | undefined =>
  p.images.find((i) => i.estPrincipale) ?? p.images[0];