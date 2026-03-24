export const PREDEFINED_TASKS = [
  { name: "Media Mode", description: "Music/Video Controls", appUrl: "" },
  { name: "Mouse Mode", description: "Cursor Control", appUrl: "" },
  { name: "Reader Mode", description: "Infinite Scroll", appUrl: "" },
  { name: "Camera Mode", description: "Remote Shutter", appUrl: "" },
  { name: "Environment Mode", description: "Passive Monitor", appUrl: "" },
  { name: "Slides Mode", description: "Presentation Tool", appUrl: "" },
  { name: "Open Chrome", description: "Launch Chrome browser", appUrl: "https://www.google.com/chrome" },
  { name: "Open Brave", description: "Launch Brave browser", appUrl: "https://brave.com" },
  { name: "Open Gallery", description: "Open local gallery", appUrl: "" },
  { name: "Open File Explorer", description: "Open file system", appUrl: "" },
  { name: "Open WhatsApp", description: "Launch WhatsApp Web", appUrl: "https://web.whatsapp.com" },
];

export const TASK_GESTURE_RULES = {
  "Media Mode": [
    "Swipe: Change volume & tracks",
    "Hold: Play / Pause or Mute",
    "Controls music & video"
  ],
  "Mouse Mode": [
    "Wave: Move the cursor",
    "Hold: Left click",
    "Blow: Wake up the screen"
  ],
  "Reader Mode": [
    "Tilt: Auto-scroll up / down",
    "Speed depends on tilt angle",
    "Infinite scroll support"
  ],
  "Camera Mode": [
    "Swipe: Start timer",
    "Swipe: Switch photo / video",
    "Hold: Remote shutter capture"
  ],
  "Environment Mode": [
    "Passive monitoring only",
    "Displays room temperature",
    "Displays pressure (hPa)"
  ],
  "Slides Mode": [
    "Swipe: Next / Prev slide",
    "Swipe: Start / End presentation",
    "Tilt: Zoom in / out",
    "Hold: Laser pointer"
  ]
};

