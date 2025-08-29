import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCarAds, getBrands, getModelsByBrandId } from '../api/api';
import CarAdCard from '../components/CarAdCard';
import { CarAd, CarBrand, CarModel } from '../types';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

interface SearchForm {
  keyword: string;
  carBrandId?: number;
  carModelId?: number;
  minPrice?: number;
  maxPrice?: number;
  isImported?: boolean;
  isBiddable?: boolean;
}

function Home() {
  const { register, handleSubmit, watch, setValue } = useForm<SearchForm>();
  const selectedBrandId = watch('carBrandId');
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});

  const { data: carAds = [], isLoading, error } = useQuery<CarAd[], Error>({
    queryKey: ['carAds', searchParams],
    queryFn: () => getCarAds(searchParams),
  });

  const { data: brands = [] } = useQuery<CarBrand[]>({ queryKey: ['brands'], queryFn: getBrands });
  const { data: models = [] } = useQuery<CarModel[], Error>({
    queryKey: ['models', selectedBrandId],
    queryFn: () => getModelsByBrandId(selectedBrandId || 0),
    enabled: !!selectedBrandId,
  });

  const onSearch = (data: SearchForm) => {
    const params: Record<string, any> = {};
    if (data.keyword) params.keyword = data.keyword;
    if (data.carBrandId) params.carBrandId = data.carBrandId;
    if (data.carModelId) params.carModelId = data.carModelId;
    if (data.minPrice) params.minPrice = data.minPrice;
    if (data.maxPrice) params.maxPrice = data.maxPrice;
    if (data.isImported !== undefined) params.isImported = data.isImported;
    if (data.isBiddable !== undefined) params.isBiddable = data.isBiddable;
    setSearchParams(params);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Car Listings</h1>
      <form onSubmit={handleSubmit(onSearch)} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Keyword</label>
            <input
              {...register('keyword')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by description..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Car Brand</label>
            <select
              {...register('carBrandId')}
              onChange={(e) => {
                setValue('carBrandId', parseInt(e.target.value) || undefined);
                setValue('carModelId', undefined);
              }}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Car Model</label>
            <select
              {...register('carModelId')}
              disabled={!selectedBrandId}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">All Models</option>
              {models.map((model) => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price Range</label>
            <div className="flex space-x-2">
              <input
                type="number"
                {...register('minPrice')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min Price"
              />
              <input
                type="number"
                {...register('maxPrice')}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max Price"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('isImported')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Imported</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('isBiddable')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Biddable</span>
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 w-full md:w-auto bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Search
        </button>
        
      </form>
      {isLoading ? (
        <p className="text-center py-8">Loading...</p>
      ) : error ? (
        <p className="text-center py-8 text-red-600">Failed to load ads: {error.message}</p>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {carAds.length > 0 ? (
            carAds.map((ad) => (
              <CarAdCard key={ad.id} ad={ad} />
            ))
          ) : (
            <p className="text-center text-gray-600">No listings found</p>
          )}
        </motion.div>
      )}
    </div>
  );
}

export default Home;