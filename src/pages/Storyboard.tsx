
import React from "react";
import { getStoryboardHistory, clearStoryboardHistory, StoryboardHistoryItem } from "@/utils/storyboardHistory";
import SceneCard from "@/components/SceneCard";
import Navbar from "@/components/Navbar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trash2 } from "lucide-react";

function formatDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleString();
}

const Storyboard = () => {
  const [history, setHistory] = React.useState<StoryboardHistoryItem[]>([]);

  React.useEffect(() => {
    setHistory(getStoryboardHistory());
  }, []);

  const handleClear = () => {
    if (confirm("Clear all storyboard history?")) {
      clearStoryboardHistory();
      setHistory([]);
    }
  };

  const handleCopyPrompts = (scenes: StoryboardHistoryItem["scenes"]) => {
    const prompts = scenes.map((s) => s.aiPrompt).join("\n\n");
    navigator.clipboard.writeText(prompts);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-fuchsia-50">
      <Navbar />
      <div className="pt-24 max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-blue-800 via-fuchsia-700 to-purple-700 bg-clip-text text-transparent">
            Storyboard History
          </h1>
          <button
            onClick={handleClear}
            className="flex items-center gap-1 px-3 py-1.5 bg-white/80 border border-fuchsia-100 rounded-lg text-fuchsia-700 text-xs font-bold hover:bg-fuchsia-50 hover:text-fuchsia-900 transition ml-4"
          >
            <Trash2 size={16} />
            Clear all
          </button>
        </div>
        {history.length === 0 && (
          <div className="text-center py-24 text-lg text-slate-500">No storyboard history yet 🤷‍♂️<br />Generate some storyboards on the homepage!</div>
        )}
        {history.length > 0 && (
          <Tabs defaultValue={history[0]?.id} className="">
            <TabsList className="mb-8 gap-2">
              {history.map((item, idx) => (
                <TabsTrigger key={item.id} value={item.id} className="bg-white/80 text-blue-700 font-semibold px-4 py-2 rounded-lg border border-blue-100 shadow">
                  {idx === 0 ? "Latest" : `#${history.length - idx}`} 
                  <span className="text-xs text-slate-400 ml-2">{formatDate(item.generatedAt)}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            {history.map((item) => (
              <TabsContent key={item.id} value={item.id}>
                <div className="rounded-xl bg-gradient-to-br from-white via-blue-50 to-pink-50 shadow-lg border border-fuchsia-100 p-5 mb-4">
                  <div className="mb-5">
                    <span className="text-lg font-bold mr-2 text-purple-700">Source Script:</span>
                    <span className="bg-blue-50 px-3 py-2 rounded font-mono text-slate-700 text-sm">{item.sourceScript.slice(0, 300) || <i>[empty]</i>}</span>
                  </div>
                  <div className="flex flex-col md:flex-row gap-5 mb-4">
                    {item.scenes.map((scene) => (
                      <div key={scene.number} className="md:flex-1">
                        <SceneCard scene={scene} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      onClick={() => handleCopyPrompts(item.scenes)}
                      className="inline-flex items-center px-5 py-2 bg-gradient-to-br from-blue-700 to-fuchsia-400 text-white rounded-lg font-bold shadow hover:from-fuchsia-600 hover:to-blue-700 transition"
                    >
                      Copy All Prompts
                    </button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Storyboard;
