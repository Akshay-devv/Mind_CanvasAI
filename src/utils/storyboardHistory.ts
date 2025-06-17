
import { StoryScene } from "@/types/storyboard";

export type StoryboardHistoryItem = {
  id: string; // unique, for example a timestamp or uuid
  generatedAt: number;
  sourceScript: string;
  scenes: StoryScene[];
};

const STORAGE_KEY = "storyboardHistory";

function loadHistory(): StoryboardHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoryboardHistoryItem[];
  } catch {
    return [];
  }
}

function saveHistory(history: StoryboardHistoryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function addStoryboardToHistory(sourceScript: string, scenes: StoryScene[]) {
  const history = loadHistory();
  const newItem: StoryboardHistoryItem = {
    id: `${Date.now()}`,
    generatedAt: Date.now(),
    sourceScript,
    scenes,
  };
  history.unshift(newItem); // latest first
  saveHistory(history.slice(0, 20)); // keep max 20 entries
}

export function getStoryboardHistory(): StoryboardHistoryItem[] {
  return loadHistory();
}

export function clearStoryboardHistory() {
  saveHistory([]);
}
