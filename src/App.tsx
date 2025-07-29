import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PostDetailPage from './features/posts/pages/PostsDetailPage';
import CreatePostPage from './features/posts/pages/CreatePostPage';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Page d'accueil sans Layout */}
        <Route path="/" element={<HomePage />} />
        
        {/* Pages avec Layout */}
        <Route element={<Layout />}>
          <Route path="/posts/create" element={<CreatePostPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;