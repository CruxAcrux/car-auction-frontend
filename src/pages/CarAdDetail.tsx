import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCarAdById, placeBid, buyFixedPrice, getBidsByCarAdId } from '../api/api';
import { useAuthStore } from '../store/authStore';
import { CarAd, Bid } from '../types';
import ImageCarousel from '../components/ImageCarousel';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';

interface BidFormData {
  bidAmount: number;
}

function CarAdDetail() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuthStore(); // Removed userId
  const { register, handleSubmit, reset, formState: { errors } } = useForm<BidFormData>();

  const { data: carAd, isLoading: adLoading, error: adError } = useQuery<CarAd, Error>({
    queryKey: ['carAd', id],
    queryFn: () => getCarAdById(id!),
  });

  const { data: bids = [], isLoading: bidsLoading } = useQuery<Bid[], Error>({
    queryKey: ['bids', id],
    queryFn: () => getBidsByCarAdId(id!),
    enabled: !!carAd?.isBiddable,
  });

  const onBidSubmit = async (data: BidFormData) => {
    if (!isAuthenticated) {
      toast.error('Please log in to place a bid');
      return;
    }
    try {
      await placeBid({ carAdId: id!, amount: data.bidAmount });
      toast.success('Bid placed successfully!');
      reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to place bid');
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to buy');
      return;
    }
    try {
      await buyFixedPrice(id!);
      toast.success('Purchase successful!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to buy');
    }
  };

  if (adLoading) return <p className="text-center py-8">Loading...</p>;
  if (adError || !carAd) return <p className="text-center py-8 text-red-600">Failed to load ad: {adError?.message}</p>;

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {carAd.carBrand} {carAd.carModel}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <ImageCarousel images={carAd.imageUrls || []} />
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Details</h2>
            <p><strong>Registreringsnummer:</strong> {carAd.registrationNumber}</p>
            <p><strong>Import / Införsel:</strong> {carAd.isImported ? 'Yes' : 'No'}</p>
            <p><strong>Utrustning:</strong> {carAd.equipment || 'N/A'}</p>
            <p><strong>Beskrivning:</strong> {carAd.description}</p>
            <p><strong>Skapad:</strong> {new Date(carAd.createdAt).toLocaleDateString('sv-SE')}</p>
            {carAd.isBiddable && carAd.auctionEndDate && (
              <p><strong>Auction Ends:</strong> {new Date(carAd.auctionEndDate).toLocaleDateString('sv-SE')}</p>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Bud</h2>
            <p className="text-lg font-bold text-blue-600">
              {carAd.fixedPrice ? `Köp nu: ${carAd.fixedPrice.toLocaleString('sv-SE')} SEK` : ''}
              {carAd.currentHighestBid ? `Current Bid: ${carAd.currentHighestBid.toLocaleString('sv-SE')} SEK` : ' No Bids'}
            </p>
            {isAuthenticated && carAd.isBiddable && !carAd.isSold && (
              <form onSubmit={handleSubmit(onBidSubmit)} className="mt-4">
                <input
                  type="number"
                  {...register('bidAmount', {
                    required: 'Bid amount is required',
                    min: {
                      value: (carAd.currentHighestBid || 0) + 1,
                      message: 'Bid must be higher than current bid',
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your bid"
                />
                {errors.bidAmount && <p className="mt-1 text-sm text-red-600">{errors.bidAmount.message}</p>}
                <button
                  type="submit"
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Ange bud
                </button>
              </form>
            )}
            {isAuthenticated && carAd.fixedPrice && !carAd.isSold && (
              <button
                onClick={handleBuyNow}
                className="mt-3 w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
              >
                Köp nu för {carAd.fixedPrice.toLocaleString('sv-SE')} SEK
              </button>
            )}
          </div>
          {carAd.isBiddable && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Bid History</h2>
              {bidsLoading ? (
                <p>Loading bids...</p>
              ) : bids.length > 0 ? (
                <ul className="space-y-2">
                  {bids.map((bid) => (
                    <li key={bid.id} className="flex justify-between text-sm">
                      <span>{bid.userName}</span>
                      <span>{bid.amount.toLocaleString('sv-SE')} SEK - {new Date(bid.createdAt).toLocaleString('sv-SE')}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No bids yet</p>
              )}
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </motion.div>
  );
}

export default CarAdDetail;