import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { ImageUpload } from '../components/ImageUpload';
import { CloudinaryService } from '../services/cloudinary.service';
import { postsService } from '../services/posts.service';
import { PostType, PostCondition, CreatePostDto } from '../types/post.types';
import { CreatePostFormValues } from '../types/create-post.types';

// Unités prédéfinies
const UNITS = ['kg', 'g', 'L', 'mL', 'pièce(s)', 'paquet(s)', 'boîte(s)', 'autre'];

// Schéma de validation Yup
const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Le titre est obligatoire')
    .min(5, 'Le titre doit contenir au moins 5 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  
  description: Yup.string()
    .max(1000, 'La description ne peut pas dépasser 1000 caractères'),
  
  type: Yup.string()
    .oneOf(['free', 'paid'], 'Type invalide')
    .required('Veuillez choisir si l\'annonce est gratuite ou payante'),
  
  price: Yup.string().when('type', {
    is: 'paid',
    then: (schema) => schema
      .required('Le prix est obligatoire pour une annonce payante')
      .matches(/^\d+(\.\d{0,2})?$/, 'Prix invalide'),
    otherwise: (schema) => schema.notRequired()
  }),
  
  quantity: Yup.object().shape({
    value: Yup.string()
      .required('La quantité est obligatoire')
      .matches(/^\d+(\.\d+)?$/, 'Quantité invalide'),
    unit: Yup.string()
      .required('L\'unité est obligatoire')
  }),
  
  condition: Yup.string()
    .oneOf(Object.values(PostCondition))
    .required('L\'état est obligatoire'),
  
  city: Yup.string()
    .required('La ville est obligatoire')
    .min(2, 'Nom de ville invalide'),
  
  mainPhoto: Yup.mixed()
    .required('La photo principale est obligatoire')
});

const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCustomUnit, setShowCustomUnit] = useState(false);

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
        <h1 className="text-3xl font-bold mb-8 font-crimson">Publier une annonce:</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
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
                    <Field
                      name="title"
                      as={Input}
                      placeholder="Ex : Lot de tissus recyclés, Vaisselle en surplus..."
                      className={errors.title && touched.title ? 'border-red-500' : ''}
                    />
                    {errors.title && touched.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-lg font-semibold mb-2">Description :</label>
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
                        className="w-full bg-teal-600 text-white hover:bg-teal-700"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Proposer un prix avec l'IA
                      </Button>
                    </div>
                  )}

                  {/* Quantité */}
                  <div>
                    <label className="block text-lg font-semibold mb-2">Quantité :</label>
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
                  className="bg-teal-600 hover:bg-teal-700 text-white px-12 py-3 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Publication en cours...' : 'Publier l\'annonce'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreatePostPage;