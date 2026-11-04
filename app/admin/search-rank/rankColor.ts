export function rankColor(position: number | null | undefined): string {
  if (position == null) return 'rank-muted';
  return position <= 5 ? 'rank-top-five' : 'rank-beyond-five';
}
