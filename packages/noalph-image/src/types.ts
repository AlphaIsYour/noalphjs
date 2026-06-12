export interface ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  lazy?: boolean
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  className?: string
  style?: string
  sizes?: string
}
