import { useState } from "react";
import { Star, Check, X, Trash2 } from "lucide-react";
import { useReviewsQuery, useUpdateReviewStatus, useDeleteReview } from "../hooks/useReviews";
import StatusBadge from "../../../components/StatusBadge";
import { formatDate } from "../../../lib/format";

const FILTERS = ["All", "pending", "approved", "rejected"];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? "fill-brand-gold text-brand-gold" : "text-gray-600"}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [filter, setFilter] = useState("All");
  const { data: reviews = [], isLoading } = useReviewsQuery(filter === "All" ? undefined : filter);
  const updateStatus = useUpdateReviewStatus();
  const deleteReview = useDeleteReview();

  const handleDelete = (id: number) => {
    if (confirm("Delete this review? This cannot be undone.")) {
      deleteReview.mutate(id);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-serif-brand text-2xl font-semibold text-brand-black">Reviews</h1>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
              filter === status
                ? "bg-brand-gold text-brand-black"
                : "bg-brand-black-soft text-gray-400 hover:text-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl bg-brand-black-soft">
        {isLoading ? (
          <p className="p-6 text-sm text-gray-400">Loading...</p>
        ) : reviews.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">No reviews found.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Rating</th>
                <th className="px-5 py-3 font-medium">Comment</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td className="px-5 py-3 font-medium text-white">{review.product_name}</td>
                  <td className="px-5 py-3 text-gray-400">
                    <p className="text-gray-200">{review.customer_name}</p>
                    <p className="text-xs text-gray-500">{review.customer_email}</p>
                  </td>
                  <td className="px-5 py-3">
                    <Stars rating={review.rating} />
                  </td>
                  <td className="max-w-xs px-5 py-3 text-gray-400">
                    {review.comment || <span className="text-gray-600">No comment</span>}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{formatDate(review.created_at)}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={review.status} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {review.status !== "approved" && (
                        <button
                          onClick={() => updateStatus.mutate({ id: review.id, status: "approved" })}
                          disabled={updateStatus.isPending}
                          className="text-gray-400 hover:text-emerald-400 disabled:opacity-40"
                          aria-label="Approve"
                        >
                          <Check className="h-4 w-4" strokeWidth={2} />
                        </button>
                      )}
                      {review.status !== "rejected" && (
                        <button
                          onClick={() => updateStatus.mutate({ id: review.id, status: "rejected" })}
                          disabled={updateStatus.isPending}
                          className="text-gray-400 hover:text-amber-400 disabled:opacity-40"
                          aria-label="Reject"
                        >
                          <X className="h-4 w-4" strokeWidth={2} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="text-gray-400 hover:text-red-400"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
