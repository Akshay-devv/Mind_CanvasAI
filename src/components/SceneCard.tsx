
import React from "react";
import { StoryScene } from "@/types/storyboard";

/**
 * Props:
 * - scene: StoryScene
 */
const SceneCard: React.FC<{ scene: StoryScene }> = ({ scene }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 min-w-[380px] max-w-sm flex flex-col p-6 hover:shadow-md hover:border-slate-200 transition-all duration-300 group">
    {/* Scene Number Badge */}
    <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 text-slate-600 rounded-xl font-bold text-lg mb-4 group-hover:bg-slate-200 transition-colors">
      {scene.number}
    </div>

    {/* Scene Title */}
    <h3 className="font-bold text-xl text-slate-900 mb-2 leading-tight">{scene.title}</h3>
    {/* Emotion */}
    <div className="text-sm text-blue-600 font-semibold mb-3">{scene.emotion}</div>
    
    {/* Scene Summary */}
    <p className="text-slate-700 text-base mb-4">{scene.summary}</p>
    
    {/* Visual Details */}
    <div className="space-y-1 text-sm text-slate-700 mb-1">
      <div>
        <span className="font-semibold text-slate-500">Environment: </span>
        {scene.visual}
      </div>
      <div>
        <span className="font-semibold text-slate-500">Characters: </span>
        {scene.characters}
      </div>
      <div>
        <span className="font-semibold text-slate-500">Lighting: </span>
        {scene.lighting}
      </div>
      <div>
        <span className="font-semibold text-slate-500">Camera: </span>
        {scene.camera}
      </div>
    </div>

    {/* AI Prompt Section */}
    <div className="mt-5">
      <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Image Prompt</span>
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
        <p className="font-mono text-xs text-slate-600 leading-relaxed select-all break-words">
          {scene.aiPrompt}
        </p>
      </div>
    </div>

    {/* Dialogue/Caption */}
    <div className="mt-5 px-2 py-2 rounded-xl border border-slate-100 bg-blue-50 text-blue-900 text-sm font-mono italic">
      {scene.caption}
    </div>
  </div>
);

export default SceneCard;
