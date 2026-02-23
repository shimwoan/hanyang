import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, type Product } from '@/lib/supabase'

const PAGE_SIZE = 12

export function useInfiniteProducts(category: string | null) {
  return useInfiniteQuery<Product[]>({
    queryKey: ['products', category],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .range(pageParam as number, (pageParam as number) + PAGE_SIZE - 1)

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined
      return allPages.length * PAGE_SIZE
    },
  })
}

export function useCategories() {
  return useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category')
      if (error) throw error
      const cats = [...new Set(data.map((d: { category: string }) => d.category))]
      return cats
    },
  })
}

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
  })
}

export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },
  })
}

async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file)
  if (error) throw error
  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName)
  return data.publicUrl
}

type CreateProductInput = {
  name: string
  category: string
  description: string
  price: number
  mainImageFile: File
  detailImageFiles: File[]
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateProductInput) => {
      const mainImageUrl = await uploadImage(input.mainImageFile)
      const detailImageUrls = await Promise.all(
        input.detailImageFiles.map(uploadImage)
      )

      const { data, error } = await supabase.from('products').insert({
        name: input.name,
        category: input.category,
        description: input.description,
        price: input.price,
        main_image: mainImageUrl,
        detail_images: detailImageUrls,
      }).select().single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
