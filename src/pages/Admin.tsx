import { useState, useEffect } from 'react'
import AdminLogin from '@/components/AdminLogin'
import ProductForm from '@/components/ProductForm'
import { useProducts, useDeleteProduct } from '@/hooks/useProducts'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Trash2 } from 'lucide-react'

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const { data: products, isLoading } = useProducts()
  const deleteProduct = useDeleteProduct()

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === 'true') {
      setAuthed(true)
    }
  }, [])

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 상품을 삭제하시겠습니까?`)) return
    await deleteProduct.mutateAsync(id)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">상품 관리</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            sessionStorage.removeItem('admin_auth')
            setAuthed(false)
          }}
        >
          로그아웃
        </Button>
      </div>

      <div className="mb-12 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">새 상품 등록</h2>
        <ProductForm />
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">등록된 상품</h2>
        {isLoading ? (
          <p className="text-muted-foreground">로딩 중...</p>
        ) : products && products.length > 0 ? (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이미지</TableHead>
                  <TableHead>상품명</TableHead>
                  <TableHead>카테고리</TableHead>
                  <TableHead>가격</TableHead>
                  <TableHead className="w-16">삭제</TableHead>
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
                    <TableCell>{product.price.toLocaleString()}원</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deleteProduct.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
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
