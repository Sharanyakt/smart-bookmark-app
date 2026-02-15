"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  // 🔐 Check login session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 📥 Load bookmarks
  useEffect(() => {
    if (!user) return;
    fetchBookmarks();

    const channel = supabase
      .channel("realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => fetchBookmarks()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false });

    setBookmarks(data || []);
  };

  const addBookmark = async () => {
    if (!title || !url) {
      alert("Enter title & url");
      return;
    }

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user.id,
    });

    setTitle("");
    setUrl("");
    fetchBookmarks(); // instant update
  };

  const deleteBookmark = async (id) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    fetchBookmarks(); // instant update
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-pink-50 to-amber-50">
        <p className="text-gray-800 text-xl font-semibold animate-pulse">
          Loading...
        </p>
      </div>
    );

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-yellow-50 via-pink-50 to-amber-50">
        {/* Floating background shapes */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-pink-200 rounded-full opacity-20 blur-3xl animate-floatSlow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200 rounded-full opacity-20 blur-3xl animate-floatSlow2"></div>
        <div className="absolute top-1/3 left-1/2 w-80 h-80 bg-amber-200 rounded-full opacity-15 blur-2xl animate-floatSlow3"></div>

        <button
          onClick={() =>
            supabase.auth.signInWithOAuth({ provider: "google" })
          }
          className="bg-white text-gray-800 px-8 py-4 rounded-xl shadow-lg hover:shadow-2xl transition-all font-semibold text-lg z-10"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-yellow-50 via-pink-50 to-amber-50 relative overflow-hidden">
      {/* Floating background shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-pink-200 rounded-full opacity-20 blur-3xl animate-floatSlow"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200 rounded-full opacity-20 blur-3xl animate-floatSlow2"></div>
      <div className="absolute top-1/3 left-1/2 w-80 h-80 bg-amber-200 rounded-full opacity-15 blur-2xl animate-floatSlow3"></div>

      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            My Bookmarks
          </h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition-all"
          >
            Logout
          </button>
        </div>

        {/* Add bookmark */}
        <div className="flex gap-3">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-900 shadow-sm"
          />
          <input
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-900 shadow-sm"
          />
          <button
            onClick={addBookmark}
            className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg shadow-md transition-all font-medium"
          >
            Add
          </button>
        </div>

        {/* Bookmarks list */}
        {bookmarks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No bookmarks yet. Add some!
          </p>
        ) : (
          <div className="grid gap-4">
            {bookmarks.map((b) => (
              <div
                key={b.id}
                className="flex justify-between items-center bg-white shadow-lg rounded-xl p-4 hover:scale-105 transition-transform"
              >
                <a
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 font-semibold underline hover:text-pink-700"
                >
                  {b.title}
                </a>
                <button
                  onClick={() => deleteBookmark(b.id)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes floatSlow2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(15px); }
        }
        @keyframes floatSlow3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-floatSlow { animation: floatSlow 10s ease-in-out infinite; }
        .animate-floatSlow2 { animation: floatSlow2 12s ease-in-out infinite; }
        .animate-floatSlow3 { animation: floatSlow3 14s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
