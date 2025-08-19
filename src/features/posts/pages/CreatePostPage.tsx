import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import { ImageUpload } from '../components/ImageUpload';
import { CloudinaryService } from '../services/cloudinary.service';
import { postsService } from '../services/posts.service';
import { PostType, PostCondition, CreatePostDto, Category } from '../types/post.types';
import { CreatePostFormValues } from '../types/create-post.types';
import { createPostValidationSchema } from '../utils/createPostValidation';
import { usePriceEstimation } from '../hooks/usePriceEstimation';
import { useFieldSuggestions } from '../hooks/useFieldSuggestions';
import { useCategories, useCreateCategory } from '../hooks/useCategories';

// Unités prédéfinies
const UNITS = ['kg', 'L', 'pièce(s)', 'paquet(s)', 'boîte(s)', 'autre'];

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomUnit, setShowCustomUnit] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const { estimatePrice, isEstimating, error: estimationError } = usePriceEstimation();
  const { generateSuggestion, isGenerating, error: suggestionError } = useFieldSuggestions();
  const { data: categories} = useCategories();
  const { mutate: createCategory, isPending: isCreatingCategory } = useCreateCategory();

  const initialValues: CreatePostFormValues = {
    title: '',
    description: '',
    type: '',
    price: '',
    quantity: {
      value: '',
      unit: ''
    },
    condition: PostCondition.USED,
    street: '',
    city: '',
    postalCode: '',
    neighborhood: '',
    categoryId: '',
    mainPhoto: null,
    additionalPhotos: []
  };

  const handleSubmit = async (values: CreatePostFormValues) => {
    setIsSubmitting(true);
    try {
      // Upload des images sur Cloudinary
      let mainPhotoUrl = '';
      let additionalPhotosUrls: string[] = [];

      if (values.mainPhoto) {
        mainPhotoUrl = await CloudinaryService.uploadImage(values.mainPhoto);
      }

      if (values.additionalPhotos.length > 0) {
        additionalPhotosUrls = await CloudinaryService.uploadMultipleImages(values.additionalPhotos);
      }

      // Préparer les données pour l'API
      const postData: CreatePostDto = {
        title: values.title,
        description: values.description,
        type: values.type === 'free' ? PostType.FREE : PostType.PAID,
        price: values.type === 'paid' ? parseFloat(values.price) : undefined,
        quantity: {
          value: parseFloat(values.quantity.value),
          unit: values.quantity.unit
        },
        condition: values.condition as PostCondition,
        street: values.street || undefined,
        city: values.city,
        postalCode: values.postalCode || undefined,
        neighborhood: values.neighborhood || undefined,
        categoryId: values.categoryId || undefined,
        mainPhoto: mainPhotoUrl,
        additionalPhotos: additionalPhotosUrls
      };

      // Créer le post
      const createdPost = await postsService.createPost(postData);

      // Rediriger vers la page de détail avec message de succès
      navigate(`/posts/${createdPost.id}`, { 
        state: { message: 'Votre annonce a été créée avec succès !' }
      });
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert('Une erreur est survenue lors de la création de l\'annonce');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl text-[#518581] font-bold mb-8 font-crimson">Publier une annonce:</h1>

        <TooltipProvider>
          <Formik
            initialValues={initialValues}
            validationSchema={createPostValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, setFieldValue }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Colonne gauche */}
                <div className="space-y-6">
                  {/* Titre */}
                  <div>
                    <label className="block text-lg font-semibold mb-2">Titre :</label>
                    <div className="flex gap-2">
                      <Field
                        name="title"
                        as={Input}
                        placeholder="Ex : Lot de tissus recyclés, Vaisselle en surplus..."
                        className={`flex-1 ${errors.title && touched.title ? 'border-red-500' : ''}`}
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 px-3"
                              disabled={isGenerating || !values.mainPhoto}
                              onClick={async () => {
                                if (!values.mainPhoto) {
                                  alert('Veuillez d\'abord télécharger une photo principale');
                                  return;
                                }
                                
                                const suggestion = await generateSuggestion('title', {
                                  mainPhoto: values.mainPhoto,
                                  condition: values.condition as PostCondition
                                });
                                
                                if (suggestion) {
                                  setFieldValue('title', suggestion);
                                }
                              }}
                            >
                              <Sparkles className="h-4 w-4" />
                            </Button>
                          </div>
                        </TooltipTrigger>
                        {!values.mainPhoto && (
                          <TooltipContent>
                            <p>Vous devez d'abord télécharger une photo pour obtenir des suggestions</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </div>
                    {errors.title && touched.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-lg font-semibold">Description :</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 px-3"
                              disabled={isGenerating || !values.mainPhoto}
                              onClick={async () => {
                                if (!values.mainPhoto) {
                                  alert('Veuillez d\'abord télécharger une photo principale');
                                  return;
                                }
                                
                                const suggestion = await generateSuggestion('description', {
                                  mainPhoto: values.mainPhoto,
                                  existingTitle: values.title,
                                  condition: values.condition as PostCondition
                                });
                                
                                if (suggestion) {
                                  setFieldValue('description', suggestion);
                                }
                              }}
                            >
                              <Sparkles className="h-4 w-4" />
                            </Button>
                          </div>
                        </TooltipTrigger>
                        {!values.mainPhoto && (
                          <TooltipContent>
                            <p>Vous devez d'abord télécharger une photo pour obtenir des suggestions</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </div>
                    <Field
                      name="description"
                      as={Textarea}
                      rows={4}
                      placeholder="Décrivez l'objet, son état, ses particularités..."
                      className={errors.description && touched.description ? 'border-red-500' : ''}
                    />
                    {errors.description && touched.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                  </div>


                  {/* Quantité */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-lg font-semibold">Quantité :</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 px-3"
                              disabled={isGenerating || !values.mainPhoto}
                              onClick={async () => {
                                if (!values.mainPhoto) {
                                  alert('Veuillez d\'abord télécharger une photo principale');
                                  return;
                                }
                                
                                const suggestion = await generateSuggestion('quantity', {
                                  mainPhoto: values.mainPhoto,
                                  existingTitle: values.title,
                                  existingDescription: values.description,
                                  condition: values.condition as PostCondition
                                });
                                
                                if (suggestion) {
                                  // Parse the suggestion to extract value and unit
                                  const match = suggestion.match(/^(\d+\.?\d*)\s*(.*)$/);
                                  if (match) {
                                    setFieldValue('quantity.value', match[1]);
                                    setFieldValue('quantity.unit', match[2] || 'pièce(s)');
                                  } else {
                                    setFieldValue('quantity.value', suggestion);
                                  }
                                }
                              }}
                            >
                              <Sparkles className="h-4 w-4" />
                            </Button>
                          </div>
                        </TooltipTrigger>
                        {!values.mainPhoto && (
                          <TooltipContent>
                            <p>Vous devez d'abord télécharger une photo pour obtenir des suggestions</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </div>
                    <div className="flex gap-2">
                      <Field
                        name="quantity.value"
                        as={Input}
                        type="number"
                        step="any"
                        placeholder="Indiquez la quantité"
                        className={`flex-1 ${errors.quantity?.value && touched.quantity?.value ? 'border-red-500' : ''}`}
                      />
                      {!showCustomUnit ? (
                        <Select
                          value={values.quantity.unit}
                          onValueChange={(value) => {
                            if (value === 'autre') {
                              setShowCustomUnit(true);
                              setFieldValue('quantity.unit', '');
                            } else {
                              setFieldValue('quantity.unit', value);
                            }
                          }}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Unité" />
                          </SelectTrigger>
                          <SelectContent>
                            {UNITS.map(unit => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex gap-2">
                          <Field
                            name="quantity.unit"
                            as={Input}
                            placeholder="Unité personnalisée"
                            className="w-40"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setShowCustomUnit(false);
                              setFieldValue('quantity.unit', '');
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      )}
                    </div>
                    {errors.quantity && touched.quantity && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.quantity.value || errors.quantity.unit}
                      </p>
                    )}
                    {suggestionError && (
                      <p className="text-red-500 text-sm mt-1">{suggestionError}</p>
                    )}
                  </div>

                  {/* Catégorie */}
                  <div>
                    <label className="block text-lg font-semibold mb-2">Catégorie :</label>
                    {!showCustomCategory ? (
                      <Select
                        value={values.categoryId}
                        onValueChange={(value) => {
                          if (value === 'custom') {
                            setShowCustomCategory(true);
                            setFieldValue('categoryId', '');
                          } else {
                            setFieldValue('categoryId', value);
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir une catégorie (optionnel)" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((category: Category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="custom">+ Créer une nouvelle catégorie</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Nom de la nouvelle catégorie"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          disabled={!newCategoryName.trim() || isCreatingCategory}
                          onClick={() => {
                            createCategory(
                              { name: newCategoryName.trim() },
                              {
                                onSuccess: (newCategory: Category) => {
                                  setFieldValue('categoryId', newCategory.id);
                                  setShowCustomCategory(false);
                                  setNewCategoryName('');
                                }
                              }
                            );
                          }}
                        >
                          {isCreatingCategory ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Créer'}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => {
                            setShowCustomCategory(false);
                            setNewCategoryName('');
                          }}
                        >
                          Annuler
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* État */}
                  <div>
                    <label className="block text-lg font-semibold mb-2">État :</label>
                    <Select
                      value={values.condition}
                      onValueChange={(value) => setFieldValue('condition', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez l'état" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={PostCondition.NEW}>Neuf</SelectItem>
                        <SelectItem value={PostCondition.LIKE_NEW}>Comme neuf</SelectItem>
                        <SelectItem value={PostCondition.USED}>Utilisé</SelectItem>
                        <SelectItem value={PostCondition.DAMAGED}>Endommagé</SelectItem>
                        <SelectItem value={PostCondition.EXPIRED}>Expiré</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Type (Gratuit/Payant) */}
                  <div>
                    <label className="block text-lg font-semibold mb-2">Type d'annonce :</label>
                    <Select
                      value={values.type}
                      onValueChange={(value) => setFieldValue('type', value)}
                    >
                      <SelectTrigger className={errors.type && touched.type ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Choisir le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Gratuit</SelectItem>
                        <SelectItem value="paid">Payant</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && touched.type && (
                      <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                    )}
                  </div>

                  {/* Prix (si payant) */}
                  {values.type === 'paid' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-lg font-semibold mb-2">Prix :</label>
                        <Field
                          name="price"
                          as={Input}
                          type="number"
                          step="0.01"
                          placeholder="Ex : 5 € ou 0 € si don"
                          className={errors.price && touched.price ? 'border-red-500' : ''}
                        />
                        {errors.price && touched.price && (
                          <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50"
                        disabled={isEstimating || !values.title || !values.mainPhoto}
                        onClick={async () => {
                          const estimatedPrice = await estimatePrice({
                            title: values.title,
                            description: values.description,
                            quantity: values.quantity.value && values.quantity.unit ? values.quantity : undefined,
                            condition: values.condition as PostCondition,
                            mainPhoto: values.mainPhoto,
                            additionalPhotos: values.additionalPhotos
                          });
                          
                          if (estimatedPrice !== null) {
                            setFieldValue('price', estimatedPrice.toString());
                          }
                        }}
                      >
                        {isEstimating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Estimation en cours...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Proposer un prix avec l'IA
                          </>
                        )}
                      </Button>
                      {estimationError && (
                        <p className="text-red-500 text-sm mt-2">{estimationError}</p>
                      )}
                      <p className="text-gray-500 text-xs mt-2 text-center">
                        L'IA aide à proposer un prix juste et transparent
                      </p>
                    </div>
                  )}

                  {/* Localisation */}
                  <div className="space-y-4">
                    <label className="block text-lg font-semibold">Localisation :</label>
                    <Field
                      name="street"
                      as={Input}
                      placeholder="Rue (optionnel)"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Field
                        name="city"
                        as={Input}
                        placeholder="Ville *"
                        className={errors.city && touched.city ? 'border-red-500' : ''}
                      />
                      <Field
                        name="postalCode"
                        as={Input}
                        placeholder="Code postal"
                      />
                    </div>
                    <Field
                      name="neighborhood"
                      as={Input}
                      placeholder="Quartier"
                    />
                    {errors.city && touched.city && (
                      <p className="text-red-500 text-sm">{errors.city}</p>
                    )}
                  </div>
                </div>

                {/* Colonne droite - Upload d'images */}
                <div>
                  <ImageUpload
                    mainPhoto={values.mainPhoto}
                    additionalPhotos={values.additionalPhotos}
                    onMainPhotoChange={(file) => setFieldValue('mainPhoto', file)}
                    onAdditionalPhotosChange={(files) => setFieldValue('additionalPhotos', files)}
                    errors={{
                      mainPhoto: errors.mainPhoto && touched.mainPhoto ? errors.mainPhoto as string : undefined
                    }}
                  />
                </div>
              </div>

              {/* Bouton de soumission */}
              <div className="flex justify-center pt-6">
                <Button
                  type="submit"
                  className="bg-[#518581] hover:bg-teal-500 text-white px-12 py-3 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Publication en cours...' : 'Publier l\'annonce'}
                </Button>
              </div>
            </Form>
            )}
          </Formik>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default CreatePostPage;