export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        <p className="text-[14px] font-semibold text-gray-700">한양티앤씨</p>
        <p className="mt-1 text-[12px] text-gray-400">판촉물 · 생활용품</p>

        <div className="mt-4 space-y-1 text-[12px] sm:text-[13px] text-gray-500">
          <p>경기도 파주시 광탄면 샘우골길 197</p>
          <p>
            <span>T. 031-944-6164</span>
            <span className="mx-2 text-gray-300">|</span>
            <span>F. 031-944-4968</span>
          </p>
          <p>E. sgx76@naver.com</p>
        </div>

        <p className="mt-6 text-[11px] text-gray-400">
          &copy; 한양티앤씨. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
