// Mise à jour de l'application installée sur la tablette (sans pouvoir « tirer pour rafraîchir »).

declare const __BUILD__: string;
export const BUILD = typeof __BUILD__ === 'string' ? __BUILD__ : 'dev';

/** Nom du script principal d'une page (il change à chaque nouvelle version publiée). */
function mainScript(html: string): string | null {
  return html.match(/<script[^>]+type="module"[^>]+src="([^"]+)"/)?.[1] ?? null;
}

/** Vérifie en ligne si une version plus récente est publiée ; renvoie son script principal. */
export async function newVersionAvailable(): Promise<string | null> {
  if (!navigator.onLine) return null;
  try {
    const res = await fetch(`./index.html?v=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const remote = mainScript(await res.text());
    const current = document.querySelector<HTMLScriptElement>('script[type="module"]')?.getAttribute('src') ?? null;
    return remote && current && remote !== current ? remote : null;
  } catch {
    return null;
  }
}

/** Vide les caches hors ligne et recharge : la tablette récupère la toute dernière version. */
export async function forceUpdate(): Promise<void> {
  try {
    const regs = (await navigator.serviceWorker?.getRegistrations()) ?? [];
    await Promise.all(regs.map((r) => r.unregister()));
    const keys = (await caches?.keys()) ?? [];
    await Promise.all(keys.map((k) => caches.delete(k)));
  } catch {
    /* rien à nettoyer */
  }
  // Adresse unique : contourne le cache du serveur, qui peut garder l'ancienne page quelques minutes.
  location.replace(`./?v=${Date.now()}`);
}

/**
 * Au lancement et chaque fois que l'application revient au premier plan, si une nouvelle version
 * existe, on recharge — seulement sur l'écran d'accueil, pour ne jamais couper une partie.
 */
export function watchForUpdates(isSafeMoment: () => boolean): void {
  if (!import.meta.env.PROD) return;
  const check = async () => {
    if (!isSafeMoment()) return;
    const remote = await newVersionAvailable();
    if (!remote || !isSafeMoment()) return;
    // Une seule tentative par version : jamais de boucle de rechargement.
    try {
      if (sessionStorage.getItem('maj-tentee') === remote) return;
      sessionStorage.setItem('maj-tentee', remote);
    } catch {
      return;
    }
    forceUpdate();
  };
  check();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') check();
  });
}
