// Enregistrement court au micro puis réécoute : l'enfant répète le son et s'entend.
// Rien n'est conservé ni envoyé : l'enregistrement reste en mémoire le temps de la réécoute.

export function recorderAvailable(): boolean {
  return !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== 'undefined';
}

let stream: MediaStream | null = null;

async function getStream(): Promise<MediaStream> {
  if (stream && stream.active) return stream;
  stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  return stream;
}

export async function recordFor(ms: number): Promise<Blob> {
  const s = await getStream();
  const rec = new MediaRecorder(s);
  const chunks: Blob[] = [];
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  const stopped = new Promise<void>((r) => (rec.onstop = () => r()));
  rec.start();
  await new Promise((r) => setTimeout(r, ms));
  rec.stop();
  await stopped;
  return new Blob(chunks, { type: rec.mimeType });
}

export function playBlob(blob: Blob): Promise<void> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    const end = () => {
      URL.revokeObjectURL(url);
      resolve();
    };
    audio.onended = end;
    audio.onerror = end;
    audio.play().catch(end);
  });
}
