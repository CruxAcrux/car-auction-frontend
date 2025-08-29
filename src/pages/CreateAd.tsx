import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { createCarAd, getBrands, getModelsByBrandId } from '../api/api';
import type { CarBrand, CarModel } from '../types';

const AdSchema = Yup.object().shape({
  carBrandId: Yup.number().required('Required').min(1, 'Select a brand'),
  carModelId: Yup.number().required('Required').min(1, 'Select a model'),
  registrationNumber: Yup.string().required('Required'),
  technicalData: Yup.string().required('Required'),
  isImported: Yup.boolean().required('Required'),
  equipment: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  fixedPrice: Yup.number().nullable().min(0, 'Must be positive'),
  isBiddable: Yup.boolean().required('Required'),
  auctionEndDate: Yup.string().when('isBiddable', {
    is: true,
    then: (schema) => schema.required('Required').test('is-future', 'Must be a future date', (value) => {
      if (!value) return false;
      return new Date(value) > new Date();
    }),
    otherwise: (schema) => schema.nullable(),
  }),
  images: Yup.array()
    .of(Yup.mixed().required('Image is required'))
    .min(1, 'At least one image is required')
    .max(15, 'Maximum 15 images allowed'),
});

const CreateAd: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [selectedBrandId, setSelectedBrandId] = useState<number>(0);

  const { data: brands = [] } = useQuery<CarBrand[], Error>({
    queryKey: ['brands'],
    queryFn: getBrands,
  });

  const { data: models = [], isLoading: modelsLoading } = useQuery<CarModel[], Error>({
    queryKey: ['models', selectedBrandId],
    queryFn: () => getModelsByBrandId(selectedBrandId),
    enabled: !!selectedBrandId,
  });

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Skapa Annons</h2>
      <Formik
        initialValues={{
          carBrandId: 0,
          carModelId: 0,
          registrationNumber: '',
          technicalData: '',
          isImported: false,
          equipment: '',
          description: '',
          fixedPrice: null as number | null,
          isBiddable: false,
          auctionEndDate: '',
          images: [] as File[],
        }}
        validationSchema={AdSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const formData = new FormData();
            formData.append('carModelId', values.carModelId.toString());
            formData.append('registrationNumber', values.registrationNumber);
            formData.append('technicalData', values.technicalData);
            formData.append('isImported', values.isImported.toString());
            formData.append('equipment', values.equipment);
            formData.append('description', values.description);
            if (values.fixedPrice) formData.append('fixedPrice', values.fixedPrice.toString());
            formData.append('isBiddable', values.isBiddable.toString());
            if (values.isBiddable && values.auctionEndDate) {
              formData.append('auctionEndDate', new Date(values.auctionEndDate).toISOString());
            }
            values.images.forEach((file) => {
              formData.append('Images', file);
            });

            const newAd = await createCarAd(formData);
            navigate(`/car-ad/${newAd.id}`);
          } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to create ad';
            setError(message);
            console.error('Create ad error:', err);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="carBrandId" className="block text-sm font-medium text-gray-700">Märke</label>
              <Field
                as="select"
                name="carBrandId"
                className="mt-1 block w-full px-3 py-2 border rounded-md"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const brandId = Number(e.target.value);
                  setFieldValue('carBrandId', brandId);
                  setFieldValue('carModelId', 0);
                  setSelectedBrandId(brandId);
                }}
              >
                <option value={0}>Välj märke</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </Field>
              <ErrorMessage name="carBrandId" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="carModelId" className="block text-sm font-medium text-gray-700">Modell</label>
              <Field
                as="select"
                name="carModelId"
                className="mt-1 block w-full px-3 py-2 border rounded-md"
                disabled={!values.carBrandId || modelsLoading}
              >
                <option value={0}>Välj modell</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </Field>
              <ErrorMessage name="carModelId" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="Registreringsnummer" className="block text-sm font-medium text-gray-700">Registreringsnummer</label>
              <Field
                type="text"
                name="Registreringsnummer"
                className="mt-1 block w-full px-3 py-2 border rounded-md"
              />
              <ErrorMessage name="Registreringsnummer" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="technicalData" className="block text-sm font-medium text-gray-700">Fordonsdata</label>
              <Field
                as="textarea"
                name="technicalData"
                className="mt-1 block w-full px-3 py-2 border rounded-md"
              />
              <ErrorMessage name="technicalData" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="isImported" className="block text-sm font-medium text-gray-700">Import / Införsel</label>
              <Field type="checkbox" name="isImported" className="mt-1" />
              <ErrorMessage name="isImported" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="equipment" className="block text-sm font-medium text-gray-700">Utrustning</label>
              <Field
                as="textarea"
                name="equipment"
                className="mt-1 block w-full px-3 py-2 border rounded-md"
              />
              <ErrorMessage name="equipment" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Beskrivning</label>
              <Field
                as="textarea"
                name="description"
                className="mt-1 block w-full px-3 py-2 border rounded-md"
              />
              <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="fixedPrice" className="block text-sm font-medium text-gray-700">Fast Pris (SEK)</label>
              <Field
                type="number"
                name="fixedPrice"
                className="mt-1 block w-full px-3 py-2 border rounded-md"
              />
              <ErrorMessage name="fixedPrice" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="isBiddable" className="block text-sm font-medium text-gray-700">Allow Bidding</label>
              <Field type="checkbox" name="isBiddable" className="mt-1" />
              <ErrorMessage name="isBiddable" component="div" className="text-red-500 text-sm" />
            </div>
            {values.isBiddable && (
              <div>
                <label htmlFor="auctionEndDate" className="block text-sm font-medium text-gray-700">Auction End Date</label>
                <Field
                  type="datetime-local"
                  name="auctionEndDate"
                  className="mt-1 block w-full px-3 py-2 border rounded-md"
                />
                <ErrorMessage name="auctionEndDate" component="div" className="text-red-500 text-sm" />
              </div>
            )}
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700">Bilder (1-15)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    setFieldValue('images', Array.from(e.target.files));
                  }
                }}
                className="mt-1 block w-full"
              />
              <ErrorMessage name="bilder" component="div" className="text-red-500 text-sm" />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Skapa Annons'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateAd;