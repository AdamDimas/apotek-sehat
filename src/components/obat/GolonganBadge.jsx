import Badge from "@/components/ui/Badge";

const TONE = { Bebas: "ok", "Bebas Terbatas": "info", Keras: "danger" };

export default function GolonganBadge({ gol }) {
  return (
    <Badge tone={TONE[gol] ?? "neutral"} dot>
      {gol}
    </Badge>
  );
}
