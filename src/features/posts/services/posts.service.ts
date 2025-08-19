
import axios from 'axios';
import { Post, CreatePostDto, UpdatePostDto, FilterPostDto, PostsResponse, Category } from '../types/post.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class PostsService {
  private baseURL = `${API_URL}/posts`;

  async getPosts(filters?: FilterPostDto): Promise<PostsResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }

    const response = await axios.get<PostsResponse>(`${this.baseURL}?${params.toString()}`);
    return response.data;
  }

  async getPostById(id: string): Promise<Post> {
    const response = await axios.get<Post>(`${this.baseURL}/${id}`);
    return response.data;
  }

  async createPost(data: CreatePostDto): Promise<Post> {
    console.log('📤 Sending post data to backend:', data);
    const response = await axios.post<Post>(this.baseURL, data);
    return response.data;
  }

  async updatePost(id: string, data: UpdatePostDto): Promise<Post> {
    const response = await axios.patch<Post>(`${this.baseURL}/${id}`, data);
    return response.data;
  }

  async deletePost(id: string): Promise<void> {
    await axios.delete(`${this.baseURL}/${id}`);
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    const response = await axios.get<Category[]>(`${this.baseURL}/categories`);
    return response.data;
  }

  async createCategory(name: string, description?: string): Promise<Category> {
    const response = await axios.post<Category>(`${this.baseURL}/categories`, { name, description });
    return response.data;
  }

  async deleteCategory(id: string): Promise<void> {
    await axios.delete(`${this.baseURL}/categories/${id}`);
  }
}

export const postsService = new PostsService();