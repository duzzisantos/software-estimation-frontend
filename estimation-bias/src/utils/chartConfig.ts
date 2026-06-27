export const TOOLTIP_STYLE: React.CSSProperties = {
  borderRadius: 14,
  border: "1px solid hsl(var(--glass-border))",
  background: "hsl(var(--glass-bg))",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  color: "hsl(var(--popover-foreground))",
  fontSize: "12px",
  boxShadow: "0 8px 32px -8px hsl(var(--glass-shadow))",
  padding: "10px 14px",
};

export const AXIS_TICK = {
  fontSize: 11,
  fill: "hsl(var(--muted-foreground))",
  fontFamily: "Inter, system-ui, sans-serif",
};

export const AXIS_LABEL_STYLE = {
  fill: "hsl(var(--muted-foreground))",
  fontSize: "11px",
  fontFamily: "Inter, system-ui, sans-serif",
};

export const GRID_STROKE = "hsl(var(--border))";
