import { useEffect, useRef, useState } from "react";
import { Download, RefreshCw, X, Share, WifiOff } from "lucide-react";
import type {
  PwaServices,
  PwaState,
} from "../../application/ports/pwaServices";

export function PwaControls({ services }: { services: PwaServices }) {
  const [state, setState] = useState<PwaState | null>(null);
  const [instructions, setInstructions] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => services.subscribe(setState), [services]);
  useEffect(() => {
    if (instructions) dialog.current?.showModal();
    else dialog.current?.close();
  }, [instructions]);
  if (!state) return null;
  return (
    <div className="pwa-controls">
      {state.offlineReady && (
        <span className="offline-state">
          <WifiOff size={15} />
          Offline siap
        </span>
      )}
      {state.canInstall && !state.installed && (
        <button className="text-button" onClick={() => void services.install()}>
          <Download size={18} />
          Instal aplikasi
        </button>
      )}
      {state.isIos && !state.installed && (
        <button className="text-button" onClick={() => setInstructions(true)}>
          <Share size={18} />
          Instal di iPhone/iPad
        </button>
      )}
      {state.updateAvailable && (
        <button className="text-button" onClick={() => void services.update()}>
          <RefreshCw size={18} />
          Perbarui aplikasi
        </button>
      )}
      <dialog
        ref={dialog}
        className="install-dialog"
        aria-label="Instal di iPhone atau iPad"
        onCancel={() => setInstructions(false)}
        onClose={() => setInstructions(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            setInstructions(false);
          }
        }}
      >
        <button
          className="icon-button"
          autoFocus
          aria-label="Tutup petunjuk instalasi"
          title="Tutup"
          onClick={() => setInstructions(false)}
        >
          <X size={20} />
        </button>
        <h2>Instal aplikasi</h2>
        <p>
          Buka aplikasi ini di Safari. Tekan menu Bagikan, lalu pilih Tambahkan
          ke Layar Utama (Add to Home Screen).
        </p>
      </dialog>
    </div>
  );
}
