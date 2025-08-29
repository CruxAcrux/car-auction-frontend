import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getCarAdById, updateCarAd, getBrands } from '../api/api';
import { useQuery } from '@tanstack/react-query';
import type { CarAd, CarBrand, CarModel } from '../types';

const AdSchema = Yup.object().shape({
  carBrandId: Yup.number().required('Required'),
  carModelId: Yup.number().required('Required'),
  registrationNumber: Yup.string().required('Required'),
  technicalData: Yup.string().required('Required'),
  isImported: Yup.boolean().required('Required'),
  equipment: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  fixedPrice: Yup.number().nullable().min(0, 'Must be positive'),
  isBiddable: Yup.boolean().required('Required'),
  auctionEndDate: Yup.string().nullable().when('isBiddable', {
    is: (value: boolean) => value,
    then: (schema) => schema.required('Required'),
    otherwise: (schema) => schema,
  }),
  images: Yup.array().min(1, 'At least 1 image required').max(15, 'Maximum 15 images'),
});

const EditAd: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [brands, setBrands] = useState<CarBrand[]>([]);
  const [models, setModels] = useState<CarModel[]>([]);

  const { data: carAd, isLoading, isError } = useQuery<CarAd | undefined, Error>({
    queryKey: ['carAd', id],
    queryFn: () => {
      if (!id) throw new Error('Invalid ad ID');
      return getCarAdById(id);
    },
    enabled: !!id,
  });

  useEffect(() => {
    getBrands()
      .then((data) => {
        setBrands(data);
        if (carAd) {
          const brand = data.find((b) => b.models.some((m) => m.id === carAd.carModelId));
          if (brand) {
            setModels(brand.models);
          }
        }
      })
      .catch(() => setError('Failed to load brands'));
  }, [carAd]);

  const handleBrandChange = (brandId: string, setFieldValue: (field: string, value: any) => void) => {
    setFieldValue('carBrandId', brandId ? Number(brandId) : '');
    setFieldValue('carModelId', '');
    const brand = brands.find((b) => b.id === Number(brandId));
    setModels(brand?.models || []);
  };

  if (!id) return <p className="text-center text-red-500">Invalid ad ID</p>;
  if (isLoading) return <p className="text-center">Loading...</p>;
  if (isError || !carAd) return <p className="text-center text-red-500">Car ad not found</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Car Ad</h2>
      <Formik
        initialValues={{
          carBrandId: brands.find((b) => b.models.some((m) => m.id === carAd.carModelId))?.id || '',
          carModelId: carAd.carModelId,
          registrationNumber: carAd.registrationNumber,
          technicalData: carAd.technicalData,
          isImported: carAd.isImported,
          equipment: carAd.equipment,
          description: carAd.description,
          fixedPrice: carAd.fixedPrice ?? '',
          isBiddable: carAd.isBiddable,
          auctionEndDate: carAd.auctionEndDate ?? '',
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
            if (values.auctionEndDate) formData.append('auctionEndDate', values.auctionEndDate);
            values.images.forEach((file) => formData.append('images', file));

            await updateCarAd(id, formData);
            navigate(`/car-ad/${id}`);
          } catch (err) {
            setError('Failed to update ad');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="carBrandId" className="block text-sm font-medium text-gray-700">
                Brand
              </label>
              <Field
                as="select"
                name="carBrandId"
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleBrandChange(e.target.value, setFieldValue)
                }
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </Field>
              <ErrorMessage name="carBrandId" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="carModelId" className="block text-sm font-medium text-gray-700">
                Model
              </label>
              <Field
                as="select"
                name="carModelId"
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={!values.carBrandId}
              >
                <option value="">Select Model</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </Field>
              <ErrorMessage name="carModelId" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                Registration Number
              </label>
              <Field
                type="text"
                name="registrationNumber"
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <ErrorMessage name="registrationNumber" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="technicalData" className="block text-sm font-medium text-gray-700">
                Technical Data
              </label>
              <Field
                type="text"
                name="technicalData"
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <ErrorMessage name="technicalData" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="isImported" className="flex items-center">
                <Field type="checkbox" name="isImported" className="mr-2" />
                Imported
              </label>
              <ErrorMessage name="isImported" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="equipment" className="block text-sm font-medium text-gray-700">
                Equipment
              </label>
              <Field
                type="text"
                name="equipment"
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <ErrorMessage name="equipment" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="fixedPrice" className="block text-sm font-medium text-gray-700">
                Fixed Price (SEK)
              </label>
              <Field
                type="number"
                name="fixedPrice"
                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <ErrorMessage name="fixedPrice" component="div" className="text-red-500 text-sm" />
            </div>
            <div>
              <label htmlFor="isBiddable" className="flex items-center">
                <Field type="checkbox" name="isBiddable" className="mr-2" />
                Allow Bidding
              </label>
              <ErrorMessage name="isBiddable" component="div" className="text-red-500 text-sm" />
            </div>
            {values.isBiddable && (
              <div>
                <label htmlFor="auctionEndDate" className="block text-sm font-medium text-gray-700">
                  Auction End Date
                </label>
                <Field
                  type="datetime-local"
                  name="auctionEndDate"
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage name="auctionEndDate" component="div" className="text-red-500 text-sm" />
              </div>
            )}
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                Images (1-15)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setFieldValue('images', Array.from(e.target.files || []))}
                className="mt-1 block w-full"
              />
              <ErrorMessage name="images" component="div" className="text-red-500 text-sm" />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Update Ad'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditAd;