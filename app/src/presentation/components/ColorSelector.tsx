import { Check } from "lucide-react";
import { colors } from "../../domain/entities/player";
import type { ColorId } from "../../domain/entities/player";
export function ColorSelector({
  selected,
  unavailable,
  disabled,
  onSelect,
}: {
  selected: ColorId | null;
  unavailable: ColorId | null;
  disabled: boolean;
  onSelect: (color: ColorId) => void;
}) {
  return (
    <div className="swatches" role="group" aria-label="Warna karakter">
      {colors.map((color) => (
        <button
          key={color.id}
          type="button"
          className="swatch"
          aria-label={`${color.name}${color.id === unavailable ? ", milik lawan" : ""}`}
          aria-pressed={selected === color.id}
          disabled={disabled || unavailable === color.id}
          title={color.name}
          onClick={() => onSelect(color.id)}
        >
          <span className="swatch-color" style={{ backgroundColor: color.hex }}>
            {selected === color.id && (
              <Check
                size={20}
                color={
                  ["white", "yellow", "green"].includes(color.id)
                    ? "#283c32"
                    : "#fff"
                }
              />
            )}
          </span>
          <span>{color.name}</span>
        </button>
      ))}
    </div>
  );
}
