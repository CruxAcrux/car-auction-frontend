import { CarAd } from '../types';
import { Link } from 'react-router-dom';

interface CarAdCardProps {
  ad: CarAd;
}

function CarAdCard({ ad }: CarAdCardProps) {
  const baseUrl = 'http://localhost:5064';
  const imageUrl = ad.imageUrls && ad.imageUrls[0] ? `${baseUrl}${ad.imageUrls[0]}` : 'https://via.placeholder.com/300x200?text=No+Image';

  return (
    <Link
      to={`/car-ad/${ad.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={`${ad.carBrand || ''} ${ad.carModel || ''}`}
          className="w-full h-48 object-cover"
        />
        {ad.isBiddable && (
          <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Auction
          </span>
        )}
        {ad.fixedPrice && (
          <span className="absolute top-4 right-4 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            Buy Now
          </span>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800 truncate">
          {ad.carBrand || ''} {ad.carModel || ''}
        </h2>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{ad.description}</p>
        <div className="mt-3 flex justify-between items-center">
          <p className="text-base font-semibold text-blue-600">
            {ad.fixedPrice ? `${ad.fixedPrice.toLocaleString('sv-SE')} SEK` : ad.currentHighestBid ? `Current Bid: ${ad.currentHighestBid.toLocaleString('sv-SE')} SEK` : 'No Bids'}
          </p>
          {ad.isBiddable && ad.auctionEndDate && (
            <p className="text-xs text-gray-500">
              Ends: {new Date(ad.auctionEndDate).toLocaleDateString('sv-SE')}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default CarAdCard;