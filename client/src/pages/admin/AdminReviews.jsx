import React from 'react';
import { Star, MessageSquare } from 'lucide-react';

export default function AdminReviews() {
  const mockReviews = [
    { id: 1, customer: 'Alice Johnson', tech: 'John Doe', rating: 5, comment: 'Excellent and quick service! Fixed my AC in no time.', date: '2023-10-06' },
    { id: 2, customer: 'Bob Smith', tech: 'Jane Smith', rating: 4, comment: 'Good job overall, but arrived 15 mins late.', date: '2023-10-05' },
    { id: 3, customer: 'Charlie Brown', tech: 'Mike Ross', rating: 5, comment: 'Very professional and explained the issue clearly.', date: '2023-10-04' },
    { id: 4, customer: 'Diana Prince', tech: 'John Doe', rating: 2, comment: 'Did not resolve the problem completely. Had to call again.', date: '2023-10-03' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A]">Customer Reviews</h1>
        <p className="text-sm text-[#64748B] mt-1">Monitor feedback and ratings for completed services.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-2xs md:col-span-1 flex flex-col items-center justify-center">
          <div className="text-4xl font-extrabold text-[#0F172A]">4.6</div>
          <div className="flex text-yellow-400 mt-2">
            {[1, 2, 3, 4, 5].map(star => (
              <Star key={star} className={`w-5 h-5 ${star <= 4 ? 'fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
          <div className="text-xs text-[#64748B] font-bold uppercase tracking-wider mt-2">Average Rating</div>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-2xs md:col-span-3">
           <h3 className="text-sm font-bold text-[#0F172A] mb-4">Rating Breakdown</h3>
           <div className="space-y-2">
             {[5, 4, 3, 2, 1].map((star, idx) => {
               const percentage = [70, 20, 5, 3, 2][idx];
               return (
                 <div key={star} className="flex items-center gap-3 text-xs font-semibold text-[#64748B]">
                   <span className="w-8">{star} Star</span>
                   <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                     <div className="h-full bg-yellow-400" style={{ width: `${percentage}%` }}></div>
                   </div>
                   <span className="w-8 text-right">{percentage}%</span>
                 </div>
               );
             })}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockReviews.map((review) => (
          <div key={review.id} className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-2xs flex gap-4">
            <div className="hidden sm:flex w-12 h-12 rounded-full bg-blue-100 text-blue-600 items-center justify-center font-bold text-lg shrink-0">
              {review.customer.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A]">{review.customer}</h4>
                  <div className="text-xs text-[#64748B] mt-0.5">Service by <span className="font-semibold text-[#334155]">{review.tech}</span> on {review.date}</div>
                </div>
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-[#334155] bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                {review.comment}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
