import * as Yup from 'yup';
import { PostCondition } from '../types/post.types';

export const createPostValidationSchema = Yup.object().shape({
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
    otherwise: (schema) => schema.notRequired(),
  }),

  quantity: Yup.object().shape({
    value: Yup.string()
      .required('La quantité est obligatoire')
      .matches(/^\d+(\.\d+)?$/, 'Quantité invalide'),
    unit: Yup.string().required('L\'unité est obligatoire'),
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
