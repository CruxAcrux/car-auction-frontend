import { useQuery } from '@tanstack/react-query';
import { getCarAds } from '../api/api';
import { useAuthStore } from '../store/authStore';
import CarAdCard from '../components/CarAdCard';
import { CarAd } from '../types';
import { motion } from 'framer-motion';

function MyListings() {
  const { userId, isAuthenticated } = useAuthStore();

  console.log('MyListings - isAuthenticated:', isAuthenticated, 'userId:', userId);

  const { data: carAds = [], isLoading, error } = useQuery<CarAd[], Error>({
    queryKey: ['myCarAds', userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('User ID is not available');
      }
      const params = { userId };
      console.log('MyListings - Sending API request with params:', params);
      const ads = await getCarAds(params);
      console.log('MyListings - API response:', ads);
      return ads;
    },
    enabled: !!userId && isAuthenticated,
  });

  if (!isAuthenticated || !userId) {
    return <p className="text-center text-red-600 py-8">Please log in to view your listings</p>;
  }
  if (isLoading) return <p className="text-center py-8">Loading...</p>;
  if (error) return <p className="text-center py-8 text-red-600">Failed to load listings: {error.message}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Listings</h1>
      {carAds.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {carAds.map((ad) => (
            <CarAdCard key={ad.id} ad={ad} />
          ))}
        </motion.div>
      ) : (
        <p className="text-center text-gray-600">No listings found</p>
      )}
    </div>
  );
}

export default MyListings;