
import { StoryScene } from "@/types/storyboard";

type SplitMethod = "sentence" | "paragraph";

// Helper function to extract keywords and themes from text
function analyzeText(text: string) {
  const words = text.toLowerCase().split(/\s+/);
  
  // Common emotion indicators
  const emotions = {
    happy: ['happy', 'joy', 'smile', 'laugh', 'cheerful', 'excited', 'delighted'],
    sad: ['sad', 'cry', 'tears', 'sorrow', 'grief', 'melancholy', 'depressed'],
    angry: ['angry', 'rage', 'furious', 'mad', 'irritated', 'frustrated'],
    scared: ['scared', 'afraid', 'fear', 'terrified', 'frightened', 'nervous'],
    mysterious: ['mystery', 'strange', 'unknown', 'secret', 'hidden', 'dark'],
    romantic: ['love', 'heart', 'kiss', 'romance', 'tender', 'passionate'],
    adventurous: ['adventure', 'journey', 'explore', 'quest', 'brave', 'bold']
  };

  // Detect dominant emotion
  let dominantEmotion = 'contemplative';
  let maxScore = 0;
  
  for (const [emotion, keywords] of Object.entries(emotions)) {
    const score = keywords.reduce((acc, keyword) => 
      acc + (words.includes(keyword) ? 1 : 0), 0);
    if (score > maxScore) {
      maxScore = score;
      dominantEmotion = emotion;
    }
  }

  // Detect setting/environment
  const settings = {
    indoor: ['room', 'house', 'office', 'kitchen', 'bedroom', 'library', 'hall'],
    outdoor: ['outside', 'park', 'street', 'garden', 'forest', 'mountain', 'beach'],
    urban: ['city', 'building', 'street', 'cafe', 'store', 'downtown'],
    nature: ['forest', 'tree', 'river', 'mountain', 'field', 'sky', 'ocean']
  };

  let environment = 'neutral setting';
  for (const [setting, keywords] of Object.entries(settings)) {
    if (keywords.some(keyword => words.includes(keyword))) {
      environment = setting;
      break;
    }
  }

  // Detect time of day
  const timeKeywords = {
    morning: ['morning', 'dawn', 'sunrise', 'early'],
    afternoon: ['afternoon', 'noon', 'day', 'lunch'],
    evening: ['evening', 'sunset', 'dusk'],
    night: ['night', 'dark', 'midnight', 'stars']
  };

  let timeOfDay = 'day';
  for (const [time, keywords] of Object.entries(timeKeywords)) {
    if (keywords.some(keyword => words.includes(keyword))) {
      timeOfDay = time;
      break;
    }
  }

  return { dominantEmotion, environment, timeOfDay };
}

// Helper function to generate a narrative arc from a single prompt
function generateNarrativeArc(prompt: string): string[] {
  const analysis = analyzeText(prompt);
  
  // Create a connected story arc based on the prompt
  const storyTemplates = {
    adventure: [
      "The protagonist receives an unexpected call to adventure",
      "They hesitate but ultimately decide to embark on the journey",
      "The first challenge appears, testing their resolve",
      "A mentor or ally provides crucial guidance",
      "The main conflict intensifies dramatically",
      "All seems lost in the darkest moment",
      "The protagonist finds inner strength and faces the final challenge",
      "Victory is achieved and the journey comes full circle"
    ],
    mystery: [
      "A puzzling event disrupts the normal routine",
      "Initial investigation reveals strange clues",
      "The protagonist follows the first lead",
      "Red herrings and false trails emerge",
      "A breakthrough discovery changes everything",
      "The truth begins to unravel",
      "The final piece of the puzzle falls into place",
      "The mystery is solved and order is restored"
    ],
    romance: [
      "Two characters meet in an unexpected way",
      "Initial attraction mixed with uncertainty",
      "They spend time together and grow closer",
      "A misunderstanding or obstacle creates tension",
      "They are forced apart by circumstances",
      "Both realize what they've lost",
      "A grand gesture or moment of truth",
      "They reunite and commit to their future together"
    ],
    drama: [
      "The protagonist faces a difficult situation",
      "They struggle with internal conflict",
      "External pressures mount steadily",
      "A crucial decision must be made",
      "The consequences of their choice unfold",
      "They confront the reality of their situation",
      "A moment of clarity or revelation occurs",
      "Resolution brings growth and understanding"
    ]
  };

  // Determine story type based on prompt content
  let storyType = 'drama'; // default
  if (analysis.dominantEmotion === 'adventurous' || prompt.includes('journey') || prompt.includes('quest')) {
    storyType = 'adventure';
  } else if (analysis.dominantEmotion === 'mysterious' || prompt.includes('mystery') || prompt.includes('secret')) {
    storyType = 'mystery';
  } else if (analysis.dominantEmotion === 'romantic' || prompt.includes('love') || prompt.includes('romance')) {
    storyType = 'romance';
  }

  // Customize the template based on the specific prompt
  const baseArc = storyTemplates[storyType];
  
  // Extract key elements from the prompt to weave into the narrative
  const promptWords = prompt.toLowerCase();
  const keyElements = [];
  
  if (promptWords.includes('car') || promptWords.includes('drive')) keyElements.push('vehicle journey');
  if (promptWords.includes('rain') || promptWords.includes('storm')) keyElements.push('stormy weather');
  if (promptWords.includes('city')) keyElements.push('urban setting');
  if (promptWords.includes('forest') || promptWords.includes('nature')) keyElements.push('natural environment');
  if (promptWords.includes('friend') || promptWords.includes('team')) keyElements.push('companions');
  if (promptWords.includes('danger') || promptWords.includes('threat')) keyElements.push('perilous situation');
  
  // Adapt the narrative arc to include specific elements from the prompt
  return baseArc.map((scene, index) => {
    let adaptedScene = scene;
    
    // Weave in specific elements from the original prompt
    if (index === 0 && keyElements.length > 0) {
      adaptedScene += ` involving ${keyElements[0]}`;
    } else if (index === Math.floor(baseArc.length / 2) && keyElements.length > 1) {
      adaptedScene += ` in the context of ${keyElements[1]}`;
    } else if (index === baseArc.length - 1 && keyElements.length > 2) {
      adaptedScene += ` with ${keyElements[2]} playing a crucial role`;
    }
    
    // Add environment context
    if (index % 3 === 0 && analysis.environment !== 'neutral setting') {
      adaptedScene += ` in a ${analysis.environment}`;
    }
    
    return adaptedScene;
  });
}

// Helper function to generate creative visual descriptions
function generateVisualDescription(text: string, analysis: any, sceneNumber: number, totalScenes: number): string {
  const { environment, timeOfDay } = analysis;
  
  // Progress the time of day throughout the story
  const timeProgression = ['morning', 'afternoon', 'evening', 'night'];
  const progressedTime = timeProgression[Math.floor((sceneNumber - 1) / totalScenes * 4)] || timeOfDay;
  
  const visualElements = {
    indoor: {
      morning: "soft natural light streaming through windows, warm interior atmosphere",
      afternoon: "bright daylight illuminating the space, clear visibility",
      evening: "golden hour light filtering in, cozy ambient lighting",
      night: "warm lamp light, intimate indoor setting with shadows"
    },
    outdoor: {
      morning: "fresh morning air, dewy surfaces, soft golden sunlight",
      afternoon: "bright natural daylight, clear blue sky, vibrant colors",
      evening: "warm sunset hues, long shadows, romantic atmosphere",
      night: "moonlit scene, dramatic shadows, mysterious ambiance"
    },
    urban: {
      morning: "bustling city awakening, morning commute, clean streets",
      afternoon: "busy urban environment, modern architecture, city energy",
      evening: "city lights beginning to glow, rush hour atmosphere",
      night: "neon lights, urban nightlife, dramatic city shadows"
    },
    nature: {
      morning: "pristine natural beauty, morning mist, peaceful wilderness",
      afternoon: "lush natural setting, bright outdoor lighting, scenic vista",
      evening: "natural golden hour, serene landscape, warm earth tones",
      night: "starlit natural setting, moonlight on landscape, tranquil darkness"
    }
  };

  const baseDescription = visualElements[environment]?.[progressedTime] || "atmospheric setting with natural lighting";
  
  // Add narrative progression elements
  const progressionElements = [];
  if (sceneNumber <= 2) progressionElements.push('establishing atmosphere');
  else if (sceneNumber <= totalScenes / 2) progressionElements.push('building tension');
  else if (sceneNumber <= totalScenes * 0.8) progressionElements.push('dramatic intensity');
  else progressionElements.push('resolution atmosphere');
  
  return `${baseDescription}, ${progressionElements.join(', ')}`;
}

// Helper function to generate camera suggestions with narrative flow
function generateCameraAngle(text: string, sceneNumber: number, totalScenes: number): string {
  // Vary camera work based on narrative progression
  if (sceneNumber === 1) {
    return "Wide establishing shot introducing the world and characters";
  } else if (sceneNumber === totalScenes) {
    return "Pulling back to wide shot for final resolution, emotional closure";
  } else if (sceneNumber <= totalScenes * 0.3) {
    return "Medium shots building character connection and story setup";
  } else if (sceneNumber <= totalScenes * 0.7) {
    return "Dynamic camera movement following action, increasing tension";
  } else {
    return "Close-ups emphasizing emotional stakes and character reactions";
  }
}

// Helper function to generate AI art prompts with story continuity
function generateArtPrompt(text: string, analysis: any, sceneNumber: number, totalScenes: number): string {
  const { dominantEmotion, environment, timeOfDay } = analysis;
  
  // Style evolution throughout the story
  const styleProgression = {
    beginning: "establishing shot style, clear composition, introductory lighting",
    rising: "dynamic composition, increasing contrast, building energy",
    climax: "dramatic lighting, high contrast, intense atmosphere",
    resolution: "balanced composition, warm lighting, peaceful conclusion"
  };
  
  let storyStage = 'beginning';
  if (sceneNumber > totalScenes * 0.6) storyStage = 'climax';
  else if (sceneNumber > totalScenes * 0.3) storyStage = 'rising';
  else if (sceneNumber > totalScenes * 0.8) storyStage = 'resolution';
  
  const stageStyle = styleProgression[storyStage];
  
  // Environment-specific details
  const environmentDetails = {
    indoor: "interior architecture, domestic details, confined space",
    outdoor: "expansive landscape, natural elements, open environment",
    urban: "modern cityscape, architectural elements, human civilization",
    nature: "organic textures, natural beauty, untamed wilderness"
  };

  const prompt = [
    `Scene ${sceneNumber}: ${text.slice(0, 80)}`,
    environmentDetails[environment],
    stageStyle,
    `${dominantEmotion} emotional tone`,
    'cinematic composition, professional digital art, storyboard illustration'
  ].filter(Boolean).join(', ');

  return prompt;
}

/**
 * Enhanced function that can either split existing text OR generate a connected narrative
 */
export function generateStoryboard(
  userStory: string,
  splitBy: SplitMethod = "sentence"
): StoryScene[] {
  let chunks: string[] = [];

  // Check if user wants to generate multiple connected scenes from a single prompt
  if (userStory.trim().split(/[.!?]/).length === 1 && userStory.length < 200) {
    // Single prompt - generate connected narrative arc
    chunks = generateNarrativeArc(userStory);
  } else {
    // Multi-sentence story - split as before
    if (splitBy === "paragraph") {
      chunks = userStory
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean);
    } else {
      chunks = userStory
        .replace(/\n+/g, " ")
        .split(/(?<=[\.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  const totalScenes = chunks.length;
  const analysis = analyzeText(userStory);

  // Generate interconnected scenes
  const scenes: StoryScene[] = chunks.map((text, idx) => {
    const sceneNumber = idx + 1;
    
    // Create titles that show story progression
    const progressLabels = ['Opening', 'Development', 'Rising Action', 'Climax', 'Falling Action', 'Resolution'];
    const progressIndex = Math.floor((idx / totalScenes) * progressLabels.length);
    const progressLabel = progressLabels[Math.min(progressIndex, progressLabels.length - 1)];
    
    const title = `${sceneNumber}. ${progressLabel}`;

    // Character development through the story
    const characterPresence = totalScenes > 4 
      ? "Evolving main characters with developing relationships and growing stakes"
      : "Main story characters as they appear in the narrative";

    return {
      number: sceneNumber,
      title,
      summary: text,
      emotion: `${analysis.dominantEmotion.charAt(0).toUpperCase() + analysis.dominantEmotion.slice(1)} mood progressing through the narrative arc`,
      visual: generateVisualDescription(text, analysis, sceneNumber, totalScenes),
      characters: characterPresence,
      lighting: `Lighting that supports scene ${sceneNumber} of ${totalScenes} in the story progression`,
      camera: generateCameraAngle(text, sceneNumber, totalScenes),
      aiPrompt: generateArtPrompt(text, analysis, sceneNumber, totalScenes),
      caption: text.length > 80 ? text.slice(0, 77) + "..." : text,
    };
  });

  return scenes;
}
