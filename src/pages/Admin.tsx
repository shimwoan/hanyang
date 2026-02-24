import { useState, useEffect } from 'react'
import AdminLogin from '@/components/AdminLogin'
import ProductForm from '@/components/ProductForm'
import { useProducts, useDeleteProduct } from '@/hooks/useProducts'
import { type Product } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Trash2, Plus, X, ExternalLink, Pencil, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Admin() {
  const [authed, setAuthed] = useState(() => localStorage.getItem('admin_auth') === 'true')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const { data: products, isLoading } = useProducts()
  const deleteProduct = useDeleteProduct()

  useEffect(() => {
    if (!showForm && !editingProduct) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowForm(false)
        setEditingProduct(null)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [showForm, editingProduct])

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 상품을 삭제하시겠습니까?`)) return
    await deleteProduct.mutateAsync(id)
  }

  const closeModal = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 pb-8 pt-5">
      <div className="mb-10 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition">
          홈페이지
          <ExternalLink className="h-4 w-4" />
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            localStorage.removeItem('admin_auth')
            setAuthed(false)
          }}
        >
          <LogOut className="h-4 w-4 mr-1.5" />
          로그아웃
        </Button>
      </div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">상품 관리</h1>
      </div>

      {(showForm || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={closeModal}>
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg bg-white p-4 lg:p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 rounded-full p-1 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="mb-4 text-lg font-semibold">
              {editingProduct ? '상품 수정' : '새 상품 등록'}
            </h2>
            <ProductForm
              key={editingProduct?.id ?? 'new'}
              product={editingProduct ?? undefined}
              onSuccess={closeModal}
            />
          </div>
        </div>
      )}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">등록된 상품</h2>
          <Button
            onClick={() => setShowForm(true)}
            size="sm"
            className="bg-[#f07d1a] hover:bg-[#d86c10]"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            새 상품 등록
          </Button>
        </div>
        {isLoading ? (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이미지</TableHead>
                  <TableHead>상품명</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead className="w-24">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><div className="h-12 w-12 rounded bg-gray-200 animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-24 rounded bg-gray-200 animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-16 rounded bg-gray-200 animate-pulse" /></TableCell>
                    <TableCell><div className="h-4 w-12 rounded bg-gray-200 animate-pulse" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : products && products.length > 0 ? (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이미지</TableHead>
                  <TableHead>상품명</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead className="w-24">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.main_image}
                        alt={product.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Pencil className="h-4 w-4 text-gray-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deleteProduct.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-muted-foreground">등록된 상품이 없습니다.</p>
        )}
      </div>
    </div>
  )
}
