import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import Categories from "./pages/Categories.jsx";
import Catalog from "./pages/Catalog.jsx";
import PropertyDetail from "./pages/PropertyDetail.jsx";
import RentHire from "./pages/RentHire.jsx";
import Team from "./pages/Team.jsx";
import SignIn from "./pages/SignIn.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/properties" element={<Catalog />} />
        <Route path="/properties/:slug" element={<PropertyDetail />} />
        <Route path="/rent-hire" element={<RentHire />} />
        <Route path="/team" element={<Team />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      {/* Sign In renders full-bleed, without the shared navbar/footer chrome */}
      <Route path="/sign-in" element={<SignIn />} />
    </Routes>
  );
}
