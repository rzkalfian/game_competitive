import type { ArenaId } from "../domain/entities/match";
import type { CategoryId } from "../domain/entities/question";
export const arenas: { id: ArenaId; name: string; subtitle: string }[] = [
  { id: "sack", name: "Balap Karung", subtitle: "Lintasan balap" },
  { id: "pole", name: "Panjat Pinang", subtitle: "Tiang hadiah" },
  { id: "rope", name: "Tarik Tambang", subtitle: "Arena tali" },
];
export const categories: { id: CategoryId; name: string; label: string }[] = [
  { id: "math", name: "Matematika", label: "Hitung dasar" },
  {
    id: "shapes",
    name: "Benda & Bangun Ruang",
    label: "Bentuk di sekitar kita",
  },
  { id: "waste", name: "Jenis Sampah", label: "Organik, anorganik, B3" },
  { id: "plants", name: "Bagian Tumbuhan", label: "Dari akar sampai biji" },
];
