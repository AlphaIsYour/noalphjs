import { describe, it, expect } from 'vitest'
import { isEnoFile, normalizePort, slugify } from './utils.js'

describe('isEnoFile', () => {
  it('mengenali file .eno', () => {
    expect(isEnoFile('App.eno')).toBe(true)
    expect(isEnoFile('src/components/Button.eno')).toBe(true)
  })
  it('menolak bukan file .eno', () => {
    expect(isEnoFile('App.tsx')).toBe(false)
    expect(isEnoFile('index.html')).toBe(false)
  })
})

describe('normalizePort', () => {
  it('menerima port valid', () => {
    expect(normalizePort(3000)).toBe(3000)
    expect(normalizePort('8080')).toBe(8080)
  })
  it('fallback ke 3000 jika port tidak valid', () => {
    expect(normalizePort('abc')).toBe(3000)
    expect(normalizePort(0)).toBe(3000)
    expect(normalizePort(99999)).toBe(3000)
  })
})

describe('slugify', () => {
  it('mengubah teks menjadi slug', () => {
    expect(slugify('Halo Dunia')).toBe('halo-dunia')
    expect(slugify('noalph JS Framework')).toBe('noalph-js-framework')
  })
})
