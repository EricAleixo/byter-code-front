import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";
import { Tag } from "lucide-react";


export function DynamicIcon({
  name,
  className,
  color,
  style,
}: {
  name: string;
  className?: string;
  color?: string;
  style?: React.CSSProperties;
}) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>)[name];

  const merged = color ? { color, ...style } : style;

  if (!Icon) return <Tag className={className} style={merged} />;
  return <Icon className={className} style={merged} />;
}