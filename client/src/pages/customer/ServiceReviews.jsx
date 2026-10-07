import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobs, submitReview } from '../../services/jobService';
import { 
  Star, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  ArrowLeft,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

export default function ServiceReviews() {
  const [completedJobs, setCompletedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchCompletedJobs = async () => {
    try {
      const fetchedJobs = await getJobs();
      setCompletedJobs(fetchedJobs.filter(j => j.status === 'completed'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedJobs();
  }, []);

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setRating(job.review?.rating || 5);
    setComment(job.review?.comment || '');
    setSuccess(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedJob) return;

    if (selectedJob.review && selectedJob.review.rating) {
      setError('You have already submitted a review for this completed service.');
      return;
    }

    setSubmitting(true);
    try {
      const updatedJob = await submitReview(selectedJob._id, rating, comment);
      if (updatedJob) {
        setSuccess(true);
        setTimeout(() => {
          setSelectedJob(null);
          setSuccess(false);
          fetchCompletedJobs();
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans antialiased text-text-primary">
      
      {/* Navigation Top - Full Width */}
      <div className="flex items-center justify-between">
        <Link 
          to="/customer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <span className="text-[10px] font-black uppercase text-text-secondary tracking-wider">
          Service Reviews
        </span>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Completed Jobs List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-surface-primary border border-border-subtle rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-black uppercase text-text-secondary tracking-wider border-b border-border-subtle pb-3">
              Completed Service Jobs
            </h2>

            {loading ? (
              <div className="py-6 text-center text-xs font-bold text-text-secondary/50 uppercase">
                Loading history...
              </div>
            ) : completedJobs.length === 0 ? (
              <div className="py-12 text-center text-xs font-semibold text-text-secondary/70 italic">
                No completed service jobs found to review.
              </div>
            ) : (
              <div className="space-y-2">
                {completedJobs.map(job => (
                  <button
                    key={job._id}
                    type="button"
                    onClick={() => handleSelectJob(job)}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col gap-1.5 ${
                      selectedJob?._id === job._id
                        ? 'border-brand-accent bg-brand-accent/5 shadow-sm'
                        : 'border-border-subtle hover:bg-surface-secondary'
                    }`}
                  >
                    <div className="flex justify-between items-center gap-2 w-full">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-surface-secondary text-text-secondary">
                        {job.category}
                      </span>
                      {job.review && job.review.rating ? (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded flex items-center gap-0.5">
                          ✓ Reviewed ({job.review.rating}★)
                        </span>
                      ) : (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">
                          Feedback Pending
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-extrabold text-text-primary leading-snug line-clamp-1">
                      {job.title}
                    </h3>
                    <div className="text-[10px] text-text-secondary/50 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Resolved {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Review Form Card */}
        <div className="lg:col-span-7">
          {selectedJob ? (
            <div className="bg-surface-primary border border-border-subtle rounded-2xl p-6 shadow-sm space-y-6">
              
              <div className="space-y-1.5 border-b border-border-subtle pb-4">
                <span className="text-[9px] font-black uppercase text-brand-accent tracking-widest block">CUSTOMER FEEDBACK</span>
                <h2 className="text-base font-extrabold text-text-primary leading-snug">
                  Rate work for: "{selectedJob.title}"
                </h2>
                <p className="text-[10px] text-text-secondary font-semibold leading-relaxed">
                  Tech: <strong className="text-text-primary">{selectedJob.technician?.name || 'Rahul Sharma'}</strong> • Resolved on {selectedJob.scheduledDate}
                </p>
              </div>

              {success ? (
                <div className="py-10 text-center space-y-3 animate-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto shadow-sm">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-extrabold text-text-primary">Feedback Submitted!</h3>
                    <p className="text-[10px] text-text-secondary font-semibold">
                      Your rating and comments have been recorded. Thank you for rating our technician.
                    </p>
                  </div>
                </div>
              ) : selectedJob.review && selectedJob.review.rating ? (
                /* Already Reviewed State View */
                <div className="space-y-4 p-5 bg-surface-secondary rounded-2xl border border-border-subtle">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-text-primary">Your Submitted Review</span>
                    <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                      {Array.from({ length: selectedJob.review.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary font-medium italic bg-surface-primary p-3.5 rounded-xl border border-border-subtle">
                    "{selectedJob.review.comment || 'No written comment provided.'}"
                  </p>
                  <span className="text-[10px] text-text-secondary/50 font-bold uppercase block text-right">
                    Submitted on {new Date(selectedJob.review.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Rating Selector */}
                  <div className="space-y-2 text-center py-4 bg-surface-secondary rounded-xl border border-border-subtle">
                    <label className="text-[10px] font-black uppercase text-text-secondary tracking-wider block">
                      Select Star Rating
                    </label>
                    <div className="flex items-center justify-center gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 cursor-pointer transition-all hover:scale-110"
                        >
                          <Star 
                            className={`w-8 h-8 ${
                              star <= rating 
                                ? 'fill-amber-500 text-amber-500' 
                                : 'text-border-subtle fill-surface-secondary'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-widest block">
                      {rating === 5 ? 'EXCELLENT' : rating === 4 ? 'VERY GOOD' : rating === 3 ? 'AVERAGE' : rating === 2 ? 'NEEDS IMPROVEMENT' : 'POOR SERVICE'}
                    </span>
                  </div>

                  {/* Comments */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-text-primary block mb-1">
                      Review Comments
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 text-text-secondary/50">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Leave a comment about service quality, timeliness, and technician professionalism..."
                        rows={4}
                        className="w-full pl-9 pr-3 py-2.5 border border-border-subtle rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent bg-surface-secondary focus:bg-surface-primary transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 border-t border-border-subtle pt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedJob(null)}
                      className="px-4 py-2 border border-border-subtle hover:bg-surface-secondary text-text-secondary text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 bg-brand-accent hover:opacity-90 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      {submitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                  </div>

                </form>
              )}

            </div>
          ) : (
            <div className="bg-surface-primary border border-border-subtle rounded-2xl p-12 text-center space-y-3 h-full flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-14 h-14 rounded-full bg-surface-secondary flex items-center justify-center text-text-secondary/50">
                <Star className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-text-primary">Select a job to review</p>
                <p className="text-xs text-text-secondary font-semibold max-w-xs mx-auto">
                  Click on any resolved job from the left list to rate the work and submit feedback.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
