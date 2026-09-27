import React, { useEffect, useState } from "react";
import { supabaseAdmin } from "../Services/supabaseClient";

const FeedbackReports = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabaseAdmin
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load feedback reports:", error);
        setError("Failed to load feedback reports. Please try again later.");
      } else {
        setFeedback(data || []);
      }

      setLoading(false);
    };

    fetchFeedback();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Feedback Reports</h2>
          <p className="text-white/60 text-sm mt-1">
            View feedback and suggestions submitted through the website.
          </p>
        </div>
      </div>

      <div className="bg-blue-900/40 border border-white/10 rounded-2xl p-6 shadow-xl">
        {loading ? (
          <p className="text-white/70 text-sm">Loading feedback...</p>
        ) : error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : feedback.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-lg font-semibold text-white mb-2">
              No feedback reports yet
            </h3>
            <p className="text-white/60 text-sm max-w-xl mx-auto">
              Once users submit feedback or suggestions, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {feedback.map((item) => (
              <div
                key={item.id}
                className="bg-blue-950/60 border border-white/10 rounded-xl p-4 text-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/50">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleString()
                      : "Unknown date"}
                  </span>
                  {item.source && (
                    <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 text-white/70 uppercase tracking-wide">
                      {item.source}
                    </span>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap">{item.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackReports;