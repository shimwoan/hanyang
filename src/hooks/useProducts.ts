import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, type Product } from '@/lib/supabase'

const PAGE_SIZE = 20

export function useProductCount(category: string | null, search?: string) {
  return useQuery<number>({
    queryKey: ['products-count', category, search],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      if (category) {
        query = query.eq('category', category)
      }
      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      const { count, error } = await query
      if (error) throw error
      const val = count ?? 0
      if (!search) {
        localStorage.setItem(`products-count-${category ?? 'all'}`, String(val))
      }
      return val
    },
    placeholderData: () => {
      if (search) return undefined
      const cached = localStorage.getItem(`products-count-${category ?? 'all'}`)
      return cached ? Number(cached) : undefined
    },

  })
}

export function useFirstPageProducts(category: string | null, search?: string) {
  return useQuery<Product[]>({
    queryKey: ['products-first', category, search],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .range(0, PAGE_SIZE - 1)

      if (category) {
        query = query.eq('category', category)
      }
      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },

  })
}

export function useMoreProducts(category: string | null, enabled: boolean, search?: string) {
  return useInfiniteQuery<Product[]>({
    queryKey: ['products-more', category, search],
    queryFn: async ({ pageParam = PAGE_SIZE }) => {
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .range(pageParam as number, (pageParam as number) + PAGE_SIZE - 1)

      if (category) {
        query = query.eq('category', category)
      }
      if (search) {
        query = query.ilike('name', `%${search}%`)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },
    initialPageParam: PAGE_SIZE,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined
      return PAGE_SIZE + allPages.length * PAGE_SIZE
    },
    enabled,

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
      localStorage.setItem('categories', JSON.stringify(cats))
      return cats
    },
    placeholderData: () => {
      try {
        const cached = localStorage.getItem('categories')
        return cached ? JSON.parse(cached) : undefined
      } catch {
        return undefined
      }
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
      localStorage.setItem(`product-${id}`, JSON.stringify(data))
      return data
    },
    placeholderData: () => {
      try {
        const cached = localStorage.getItem(`product-${id}`)
        return cached ? JSON.parse(cached) : undefined
      } catch {
        return undefined
      }
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
  thumbnailFiles: File[]
  detailImageFiles: File[]
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateProductInput) => {
      const thumbnailUrls = await Promise.all(
        input.thumbnailFiles.map(uploadImage)
      )
      const detailImageUrls = await Promise.all(
        input.detailImageFiles.map(uploadImage)
      )

      const { data, error } = await supabase.from('products').insert({
        name: input.name,
        category: input.category,
        description: input.description,
        main_image: thumbnailUrls[0],
        thumbnail_images: thumbnailUrls,
        detail_images: detailImageUrls,
      }).select().single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['products-first'] })
      queryClient.invalidateQueries({ queryKey: ['products-more'] })
      queryClient.invalidateQueries({ queryKey: ['products-count'] })
      queryClient.invalidateQueries({ queryKey: ['product'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

type UpdateProductInput = {
  id: string
  name: string
  category: string
  description: string
  thumbnails: (File | string)[]
  detailImages: (File | string)[]
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateProductInput) => {
      const thumbnailUrls = await Promise.all(
        input.thumbnails.map((item) =>
          typeof item === 'string' ? item : uploadImage(item)
        )
      )
      const detailImageUrls = await Promise.all(
        input.detailImages.map((item) =>
          typeof item === 'string' ? item : uploadImage(item)
        )
      )

      const { data, error } = await supabase
        .from('products')
        .update({
          name: input.name,
          category: input.category,
          description: input.description,
          main_image: thumbnailUrls[0],
          thumbnail_images: thumbnailUrls,
          detail_images: detailImageUrls,
        })
        .eq('id', input.id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['products-first'] })
      queryClient.invalidateQueries({ queryKey: ['products-more'] })
      queryClient.invalidateQueries({ queryKey: ['products-count'] })
      queryClient.invalidateQueries({ queryKey: ['product'] })
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
      queryClient.invalidateQueries({ queryKey: ['products-first'] })
      queryClient.invalidateQueries({ queryKey: ['products-more'] })
      queryClient.invalidateQueries({ queryKey: ['products-count'] })
      queryClient.invalidateQueries({ queryKey: ['product'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
