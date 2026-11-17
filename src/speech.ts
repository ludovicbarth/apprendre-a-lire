// Synthèse vocale en français (Web Speech API).
// Sur la tablette, fonctionne dans Chrome. Pour l'application Android empaquetée,
// on remplacera cette implémentation par le moteur vocal natif (même interface).

let voice: SpeechSynthesisVoice | null = null;

function pickVoice(): void {
  if (!('speechSynthesis' in window)) return;
  const voices = speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('fr'));
  // On préfère une voix fr-FR locale (fonctionne hors ligne), féminine si son nom l'indique.
  const score = (v: SpeechSynthesisVoice) =>
    (v.lang === 'fr-FR' ? 4 : 0) +
    (v.localService ? 2 : 0) +
    (/female|femme|amelie|amélie|audrey|marie|julie|google/i.test(v.name) ? 1 : 0);
  voices.sort((a, b) => score(b) - score(a));
  voice = voices[0] ?? null;
}

if ('speechSynthesis' in window) {
  pickVoice();
  speechSynthesis.addEventListener('voiceschanged', pickVoice);
}

export function speechAvailable(): boolean {
  return 'speechSynthesis' in window;
}

export function speak(text: string, opts: { rate?: number; pitch?: number } = {}): Promise<void> {
  return new Promise((resolve) => {
    if (!speechAvailable()) return resolve();
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR';
    if (voice) u.voice = voice;
    u.rate = opts.rate ?? 0.85; // un peu plus lent pour une enfant
    u.pitch = opts.pitch ?? 1.1;
    let done = false;
    const finish = () => {
      if (!done) {
        done = true;
        resolve();
      }
    };
    u.onend = finish;
    u.onerror = finish;
    // Filet de sécurité : certains navigateurs n'émettent jamais `onend`.
    setTimeout(finish, 1500 + text.length * 120);
    speechSynthesis.speak(u);
  });
}

/** Prononce un son isolé, plus lentement et en l'allongeant légèrement. */
export function speakSound(say: string): Promise<void> {
  return speak(say, { rate: 0.6 });
}

export function stopSpeaking(): void {
  if (speechAvailable()) speechSynthesis.cancel();
}
