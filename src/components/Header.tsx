import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="한양티앤씨" className="h-10" />
          <span className="text-xl font-bold text-[#1a5ab6]">한양티앤씨</span>
        </Link>
        <nav>
          <Link
            to="/admin"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            관리자
          </Link>
        </nav>
      </div>
    </header>
  )
}
