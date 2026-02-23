import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import Home from '@/pages/Home'
import ProductDetail from '@/pages/ProductDetail'
import Admin from '@/pages/Admin'
import Footer from '@/components/Footer'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24h
      staleTime: 1000 * 60 * 5, // 5min
    },
  },
})

const persister = createSyncStoragePersister({
  storage: window.localStorage,
})

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: '한양티앤씨',
  description: '고무줄, 밴드, 끈, 수예용품, 판촉물, 생활용품 제조·판매 전문업체',
  telephone: '031-944-6164',
  faxNumber: '031-944-4968',
  email: 'sgx76@naver.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '광탄면 샘우골길 197',
    addressLocality: '파주시',
    addressRegion: '경기도',
    addressCountry: 'KR',
  },
}

function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

function FooterWrapper() {
  const { pathname } = useLocation()
  if (pathname === '/admin') return null
  return <Footer />
}

export default function App() {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <BrowserRouter>
        <StructuredData />
        <div className="flex min-h-screen flex-col bg-white">
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </div>
          <FooterWrapper />
        </div>
      </BrowserRouter>
    </PersistQueryClientProvider>
  )
}
