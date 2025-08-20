// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Movies from "./components/Movies";
import GlobalStyles from "./components/GlobalStyles";
import Footer from "./components/Footer";
import MovieDetails from "./components/MovieDetails";
import Search from "./components/Search";

function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Header />

      <Routes>
        <Route path="/" element={<Movies />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/search" element={<Search />} />
      </Routes>

      

      <Footer />
    </BrowserRouter>
  );
}

export default App;
