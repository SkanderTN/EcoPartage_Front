import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import PostDetailPage from './features/posts/pages/PostsDetailPage';
import CreatePostPage from './features/posts/pages/CreatePostPage';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Router>
      <Routes>       
        {/* Pages avec Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/posts/create" element={<CreatePostPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;