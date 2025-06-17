import React, { useState } from "react";
import SceneCard from "@/components/SceneCard";
import { generateStoryboard } from "@/utils/storyToStoryboardChain";
import { StoryScene } from "@/types/storyboard";
import { ArrowRight, CircleCheck, SquarePlus } from "lucide-react";
import Navbar from "@/components/Navbar";
import { addStoryboardToHistory } from "@/utils/storyboardHistory";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import { saveAnalytics } from "@/utils/analytics";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const DUMMY_SCENES = [
  {
    number: 1,
    summary: "The Hero Receives a Mysterious Letter",
    visual: "A cluttered bedroom, morning sunlight, desk covered with sketches and gadgets.",
    characters: "Alex (main character), unopened envelope, cat on window sill.",
    camera: "Wide shot from doorway, natural side lighting.",
    mood: "Curiosity, anticipation.",
    prompt: "A cozy bedroom, rays of sunlight streaming in, a desk with scattered papers and a mysterious envelope, a curious teen and a cat nearby, warm morning lighting, realistic digital art.",
  },
  {
    number: 2,
    summary: "Alex Rushes Outside",
    visual: "Front yard, sneakers hastily tied, racing down path, blowing leaves.",
    characters: "Alex, backpack, mailbox, neighbor's dog.",
    camera: "Low angle from the ground, motion blur to show speed.",
    mood: "Excitement, urgency.",
    prompt: "A young person sprinting down a leafy path, wind-swept, sneakers barely tied, mailbox in background, dynamic low-angle perspective, early morning, high-energy color palette.",
  },
  {
    number: 3,
    summary: "Arrival at the Old Oak Tree",
    visual: "Majestic oak tree, initials carved in the bark, dappled sunlight.",
    characters: "Alex, tree, carved heart symbol, sparrow perched on branch.",
    camera: "Medium shot at eye level, soft dappled shadows.",
    mood: "Nostalgia, wonder.",
    prompt: "A towering old oak tree with initials carved, sunbeams filtering through leaves, a thoughtful teen touches the bark, sparrow on branch, soft, nostalgic colors.",
  },
];

const features = [
  {
    title: "Automatic Scene Breakdown",
    icon: SquarePlus,
    desc: "Turn any story or script into structured cinematic scenes—instantly.",
  },
  {
    title: "AI Visual Planning",
    icon: ArrowRight,
    desc: "Get shot-by-shot camera directions, moods, and visual ideas generated for every scene.",
  },
  {
    title: "Creative AI Prompts",
    icon: CircleCheck,
    desc: "Copy ready-to-use prompts for Midjourney or DALL·E without lifting a finger.",
  },
];

const Index = () => {
  const [script, setScript] = useState("");
  const [scenes, setScenes] = useState<StoryScene[]>([]);
  const [loading, setLoading] = useState(false);
  const [splitBy, setSplitBy] = useState<"sentence" | "paragraph">("sentence");
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!authLoading && !user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to generate images and storyboards.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      const generatedScenes = generateStoryboard(script, splitBy);
      setScenes(generatedScenes);
      addStoryboardToHistory(script, generatedScenes);

      await saveAnalytics(script, generatedScenes.length);

      setLoading(false);
    }, 900);
  };

  const handleCopyPrompts = () => {
    const prompts = scenes.map((s) => s.aiPrompt).join("\n\n");
    navigator.clipboard.writeText(prompts);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 overflow-x-hidden">
      {/* Navbar at the top */}
      <Navbar />

      {/* Vibrant Animated Blobs */}
      <div className="pointer-events-none">
        <div className="absolute -top-28 -left-36 w-[400px] h-[400px] bg-blue-200/60 rounded-full blur-[120px] animate-pulse z-0" />
        <div className="absolute top-[12rem] left-1/2 -translate-x-1/2 w-[320px] h-[180px] bg-fuchsia-200/70 rounded-full blur-3xl z-0 animate-fade-in" style={{animationDelay: "0.15s"}}/>
        <div className="absolute bottom-0 -right-32 w-[350px] h-[350px] bg-pink-200/60 rounded-full blur-[110px] animate-pulse z-0" />
      </div>

      {/* Add padding to prevent navbar overlap */}
      <div className="pt-20 relative z-10">
        <div className="container mx-auto px-4 py-8 lg:py-16">
          {/* Header Section */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-400 to-fuchsia-400 rounded-2xl mb-8 shadow-lg animate-scale-in" />
            <h1 className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-700 via-purple-700 to-fuchsia-600 bg-clip-text text-transparent mb-6 tracking-tight drop-shadow">
              Mind<span className="text-slate-100">Canvas</span>
            </h1>
            <p className="text-xl text-purple-700/80 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow">
              Transform any story or script into a colorful, scene-by-scene cinematic storyboard with AI creative magic.
            </p>

            {/* Feature Highlights */}
            <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
              {features.map((feat, i) => (
                <div
                  key={feat.title}
                  className={`bg-gradient-to-br from-white via-blue-50 to-purple-50 border-2 border-blue-100/60 shadow-lg rounded-2xl flex flex-col items-center p-6 w-full md:w-72 transition-all hover:scale-105 hover:shadow-xl`}
                  style={{ animationDelay: `${i * 0.1 + 0.1}s` }}
                >
                  <feat.icon size={36} className="mb-3 text-blue-600 drop-shadow" aria-hidden />
                  <div className="font-semibold text-lg mb-1 text-purple-900 drop-shadow">{feat.title}</div>
                  <div className="text-blue-700/70 text-sm">{feat.desc}</div>
                </div>
              ))}
            </div>
            
            {/* Input Form */}
            <form onSubmit={handleGenerate} className="space-y-6 mx-auto max-w-2xl">
              {/* Split mode radio */}
              <div className="flex items-center justify-center gap-8 mb-2 flex-wrap">
                <span className="font-semibold text-fuchsia-700">Split by:</span>
                <RadioGroup
                  value={splitBy}
                  onValueChange={value => setSplitBy(value as "sentence" | "paragraph")}
                  className="flex gap-6"
                  aria-label="Choose how to split your story"
                >
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="sentence" checked={splitBy === "sentence"} />
                    Sentence
                  </Label>
                  <Label className="flex items-center gap-2 cursor-pointer">
                    <RadioGroupItem value="paragraph" checked={splitBy === "paragraph"} />
                    Paragraph
                  </Label>
                </RadioGroup>
              </div>
              <div className="relative">
                <textarea
                  className="w-full min-h-[140px] max-h-[280px] p-6 bg-white/80 border border-blue-200 rounded-2xl text-lg placeholder:text-slate-400 focus:border-fuchsia-400 focus:ring-0 focus:outline-none transition-all duration-200 resize-none shadow"
                  placeholder="Paste your story, script, or creative idea here..."
                  value={script}
                  onChange={e => setScript(e.target.value)}
                  disabled={loading}
                  required
                  style={{background: 'rgba(255,255,255,0.76)'}}
                />
              </div>
              <button
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-br from-blue-700 via-purple-500 to-fuchsia-500 text-white font-extrabold rounded-2xl text-lg hover:from-blue-800 hover:to-fuchsia-600 focus:bg-fuchsia-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-2xl transform hover:-translate-y-0.5"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-fuchsia-300 rounded-full animate-spin mr-3"></div>
                    Generating Storyboard...
                  </>
                ) : (
                  "Generate Storyboard"
                )}
              </button>
            </form>
          </div>
          
          {/* Decorative Divider */}
          <div className="my-12 flex items-center gap-3 max-w-2xl mx-auto">
            <div className="flex-1 h-[2px] bg-gradient-to-r from-blue-300 via-purple-300 to-pink-200" />
            <span className="px-4 py-1 bg-gradient-to-r from-blue-400/70 via-purple-400/60 to-fuchsia-300/70 text-white rounded-3xl border border-blue-200/40 shadow text-sm font-mono select-none">
              Storyboard
            </span>
            <div className="flex-1 h-[2px] bg-gradient-to-l from-blue-300 via-purple-300 to-pink-200" />
          </div>

          {/* Results Section */}
          {scenes.length > 0 && (
            <div className="max-w-7xl mx-auto z-10">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-fuchsia-700 bg-gradient-to-r from-blue-500 to-fuchsia-700 bg-clip-text text-transparent mb-3 drop-shadow">
                  Your Cinematic Storyboard
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-fuchsia-400 via-purple-400 to-blue-400 mx-auto rounded-full"></div>
                <div className="text-blue-700 mt-2 text-lg">
                  <span className="font-mono px-2 py-1 rounded bg-blue-100/70 text-blue-800 text-sm">
                    Scenes, visual plans, image prompts &amp; captions
                  </span>
                </div>
              </div>
              
              {/* Storyboard Cards */}
              <div className="flex gap-6 overflow-x-auto pb-6 px-2">
                {scenes.map((scene) => (
                  <div key={scene.number} className="bg-gradient-to-br from-white via-blue-50 to-fuchsia-50 rounded-2xl p-1 shadow-lg">
                    <SceneCard scene={scene} />
                  </div>
                ))}
              </div>
              
              {/* Copy Prompts Button */}
              <div className="text-center mt-10">
                <button
                  onClick={handleCopyPrompts}
                  className="inline-flex items-center px-6 py-3 border border-blue-400 bg-gradient-to-br from-white via-blue-50 to-fuchsia-50 text-blue-800 font-bold rounded-xl hover:bg-blue-50 hover:border-fuchsia-400 transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy All Image Prompts
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-24 pt-10 pb-8 border-t border-blue-200/70 text-center text-blue-500 text-sm">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-bold text-blue-700/80">MindCanvas</span>
            {" · "}Cinematic Storyboard Generator
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Index;
