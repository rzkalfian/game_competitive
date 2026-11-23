import { useState } from "react";
import { Smartphone, RotateCw, ArrowLeft } from "lucide-react";

export function RotationPrompt({
  onRotate,
  onBack,
}: {
  onRotate: () => Promise<void>;
  onBack: () => void;
}) {
  const [requesting, setRequesting] = useState(false);
  return (
    <section className="rotation-prompt" aria-label="Putar HP ke landscape">
      <Smartphone className="rotation-phone" size={76} aria-hidden="true" />
      <h2>Putar HP</h2>
      <p>Posisikan HP mendatar untuk bermain.</p>
      <button
        className="primary-button"
        disabled={requesting}
        onClick={async () => {
          setRequesting(true);
          try {
            await onRotate();
          } finally {
            setRequesting(false);
          }
        }}
      >
        <RotateCw size={20} />
        Coba rotasi otomatis
      </button>
      <button className="text-button" onClick={onBack}>
        <ArrowLeft size={20} />
        Kembali ke menu
      </button>
    </section>
  );
}
