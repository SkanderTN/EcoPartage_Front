export interface CreatePostFormValues {
  title: string;
  description: string;
  type: 'free' | 'paid' | '';
  price: string;
  quantity: {
    value: string;
    unit: string;
  };
  condition: string;
  street: string;
  city: string;
  postalCode: string;
  neighborhood: string;
  mainPhoto: File | null;
  additionalPhotos: File[];
}

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  // autres propriétés si nécessaire
}