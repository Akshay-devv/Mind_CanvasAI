
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

type SceneImage = {
  file: File | null;
  preview: string | null;
};

const MAX_SCENES = 5; // Arbitrary: Allow up to 5 scenes per publish

const Publish = () => {
  const { user, loading: authLoading } = useAuth();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [scenes, setScenes] = useState<SceneImage[]>(
    Array(MAX_SCENES).fill({ file: null, preview: null })
  );
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  if (authLoading) return null;
  if (!user)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-lg text-blue-700 font-bold mb-2">Please sign in to publish your idea</div>
        <a href="/auth" className="text-blue-500 underline">Sign in</a>
      </div>
    );
  const handleImageChange =
    (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const preview = URL.createObjectURL(file);
        const updatedScenes = scenes.map((scene, i) =>
          i === idx ? { file, preview } : scene
        );
        setScenes(updatedScenes);
      }
    };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setPublished(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Navbar />
      <div className="max-w-2xl mx-auto pt-28 px-4 pb-16">
        <h1 className="text-4xl font-bold mb-6 text-fuchsia-700 text-center">Publish Your Idea</h1>
        <form className="bg-white/80 border border-blue-100 rounded-2xl shadow-xl px-8 py-10 space-y-6" onSubmit={handlePublish}>
          <div>
            <label className="block font-bold text-blue-900 mb-1">Storyboard Title</label>
            <Input
              type="text"
              required
              placeholder="My Awesome Storyboard"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-bold text-blue-900 mb-1">Description</label>
            <textarea
              className="w-full rounded-lg border border-blue-200 bg-white/80 px-4 py-2 mt-1"
              required
              placeholder="Describe your idea/storyboard..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <label className="block font-bold text-blue-900 mb-2">Upload images for each scene</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scenes.map((scene, i) => (
                <div key={i} className="flex flex-col items-center p-3 border rounded-lg bg-blue-50/50">
                  <label className="mb-2 font-medium text-blue-700">Scene {i + 1}</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange(i)}
                  />
                  {scene.preview && (
                    <img
                      src={scene.preview}
                      alt={`Preview scene ${i + 1}`}
                      className="w-36 h-36 mt-2 object-cover rounded-lg border shadow"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <Button
            type="submit"
            className="w-full py-3 text-lg mt-6"
            disabled={publishing || !title || !desc}
          >
            {publishing ? "Publishing..." : "Publish"}
          </Button>
          {published && (
            <div className="text-green-600 mt-4 text-center font-semibold">
              Your storyboard has been published!
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Publish;
