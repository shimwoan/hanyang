import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tnobzhrfdxnnjrzdduuc.supabase.co'
const supabaseAnonKey = 'sb_publishable_6jHkyquae-Z4U5ymd34DVA_6Jn5J1n_'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Product = {
  id: string
  name: string
  category: string
  description: string
  price: number
  main_image: string
  thumbnail_images: string[]
  detail_images: string[]
  created_at: string
}
