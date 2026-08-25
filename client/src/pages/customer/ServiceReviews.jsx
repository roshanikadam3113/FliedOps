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

  const fetchCompletedJobs = async () => {
    try {
      const fetchedJobs = await getJobs();
      // Only jobs that are completed can be reviewed
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

    try {
      const updatedJob = await submitReview(selectedJob._id, rating, comment);
      if (updatedJob) {
        setSuccess(true);
        setTimeout(() => {
          setSelectedJob(null);
          setSuccess(false);
          fetchCompletedJobs(); // Reload jobs list
        }, 1500);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    }
  };

  return (
    <div className="space-y-6 font-sans antialiased text-[#0F172A] max-w-4xl mx-auto">
      
      {/* Navigation Top */}
      <div className="flex items-center justify-between">
        <Link 
          to="/customer/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748B] hover:text-[#0F172A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <span className="text-[10px] font-black uppercase text-[#64748B] tracking-wider">
          Service Reviews
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Completed Jobs List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-black uppercase text-[#64748B] tracking-wider border-b border-slate-100 pb-3">
              Completed Service Jobs
            </h2>

            {loading ? (
              <div className="py-6 text-center text-xs font-bold text-slate-400 uppercase">
                Loading history...
              </div>
            ) : completedJobs.length === 0 ? (
              <div className="py-12 text-center text-xs font-semibold text-slate-450 italic">
                No completed service jobs found.
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
                        ? 'border-[#F97316] bg-orange-50/20 shadow-2xs'
                        : 'border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-center gap-2 w-full">
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {job.category}
                      </span>
                      {job.review ? (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded">
                          Reviewed
                        </span>
                      ) : (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded">
                          Pending
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-extrabold text-[#0F172A] leading-snug line-clamp-1">
                      {job.title}
                    </h3>
                    <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
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
            <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-xs space-y-6">
              
              <div className="space-y-1.5 border-b border-slate-100 pb-4">
                <span className="text-[9px] font-black uppercase text-orange-500 tracking-widest block">FEEDBACK FORM</span>
                <h2 className="text-base font-extrabold text-[#0F172A] leading-snug">
                  Rate work for: "{selectedJob.title}"
                </h2>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                  Tech: <strong className="text-[#0F172A]">{selectedJob.technician?.name || 'Rahul Sharma'}</strong> • Resolved on {selectedJob.scheduledDate}
                </p>
              </div>

              {success ? (
                <div className="py-10 text-center space-y-3 animate-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 mx-auto shadow-sm">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-extrabold text-[#0F172A]">Feedback Submitted!</h3>
                    <p className="text-[10px] text-slate-500 font-semibold">
                      Your rating and comments have been recorded. Thank you.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {error && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Rating Selector */}
                  <div className="space-y-2 text-center py-4 bg-slate-50 rounded-xl border border-slate-100">
                    <label className="text-[10px] font-black uppercase text-[#64748B] tracking-wider block">
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
                                : 'text-slate-350 fill-slate-100'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] font-black uppercase text-amber-700 tracking-widest block">
                      {rating === 5 ? 'EXCELLENT' : rating === 4 ? 'VERY GOOD' : rating === 3 ? 'GOOD / AVERAGE' : rating === 2 ? 'NEEDS IMPROVEMENT' : 'POOR SERVICE'}
                    </span>
                  </div>

                  {/* Comments */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#0F172A] block mb-1">
                      Review Comments
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 text-slate-400">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Leave a comment about the service quality, technician professionalism, and resolution..."
                        rows={4}
                        className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] bg-[#F8FAFC] focus:bg-white transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                    <button
                      type="button"
                      onClick={() => setSelectedJob(null)}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-98 cursor-pointer"
                    >
                      Submit Feedback
                    </button>
                  </div>

                </form>
              )}

            </div>
          ) : (
            <div className="bg-white border border-slate-150 rounded-2xl p-12 text-center space-y-3 h-full flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <Star className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-[#0F172A]">Select a job to review</p>
                <p className="text-xs text-slate-500 font-semibold max-w-xs mx-auto">
                  Click on any resolved job from the left list to rate the work and submit comments.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
