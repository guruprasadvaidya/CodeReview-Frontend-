import React from 'react';

function ReviewSection({ reviews }) {
  return (
    <div 
      className="bg-gray-800 text-white p-4 mt-4 rounded overflow-y-auto" 
      style={{ maxHeight: "300px" }}
    >
      <h2 className="text-xl font-bold mb-2">Past Reviews</h2>
      {reviews && reviews.length > 0 ? (
        reviews.map(review => (
          <div key={review._id} className="border-b border-gray-600 py-2">
            <p>{review.aiFeedback}</p>
            <p className="text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p>No reviews found.</p>
      )}
    </div>
  );
}

export default ReviewSection;
