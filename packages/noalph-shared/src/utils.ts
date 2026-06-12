export function isEnoFile(filePath: string): boolean {
  return filePath.endsWith('.eno')
}

export function normalizePort(port: string | number): number {
  const p = typeof port === 'string' ? parseInt(port, 10) : port
  if (isNaN(p) || p < 1 || p > 65535) return 3000
  return p
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}
