import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const ADMIN_PASSWORD = '3085'

export default function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_auth', 'true')
      onLogin()
    } else {
      setError('비밀번호가 틀립니다.')
    }
  }

  return (
    <div className="mx-auto mt-20 max-w-sm">
      <h2 className="mb-6 text-center text-2xl font-bold">관리자 로그인</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
            placeholder="비밀번호를 입력하세요"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" className="w-full bg-[#1a5ab6] hover:bg-[#154a9a]">
          로그인
        </Button>
      </form>
    </div>
  )
}
