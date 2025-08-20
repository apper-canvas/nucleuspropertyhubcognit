import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import BrowseProperties from "@/components/pages/BrowseProperties"
import PropertyDetail from "@/components/pages/PropertyDetail"
import Favorites from "@/components/pages/Favorites"
import SearchResults from "@/components/pages/SearchResults"

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background font-body">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<BrowseProperties />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/search" element={<SearchResults />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  )
}

export default App