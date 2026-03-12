# 🎮 Flappy Kiro

A fun Flappy Bird-style game built with vanilla JavaScript, featuring the Kiro logo as the player character. This game was vibecoded with [Kiro AI](https://kiro.ai) during the **Kilkenny AWS Data and AI Conference 2026**!

## 🎯 Play the Game

**[Play Flappy Kiro Now!](https://marcobompani.github.io/flappy-kiro/game-application/)**

## ✨ Features

- 🖥️ **Fullscreen gameplay** - Immersive experience that fills your entire screen
- 🎵 **Background music** - Upbeat soundtrack with toggle controls
- 🔊 **Sound toggle** - Mute/unmute button with visual indicators
- 📈 **Progressive difficulty** - Game speed increases as you score higher
- 🏆 **High score tracking** - Persistent scores saved in localStorage
- 🎉 **Confetti celebration** - Special effects for new high scores
- 🎨 **Kiro brand colors** - Beautiful purple-themed UI

## 🎮 How to Play

- **Press SPACE** or **Click** to make Kiro jump
- Avoid the purple pipes
- Score points by staying alive
- Try to beat your high score!

## 🚀 Difficulty Progression

The game gets progressively harder as you improve:
- **Score 0-199**: Normal speed (1.0x)
- **Score 200-299**: 1.2x speed increase
- **Score 300-399**: 1.44x speed increase
- **Score 400+**: Continues increasing by 1.2x every 100 points

## 🛠️ Built With Kiro

This game was created during a live vibecoding session at the Kilkenny AWS Data and AI Conference using [Kiro](https://kiro.ai), an AI-powered development environment. The entire game was built through natural conversation with Kiro's AI assistant!

### What is Vibecoding?

Vibecoding is a new way of building software where you describe what you want in natural language, and Kiro's AI helps you build it. No need to remember exact syntax or API details - just describe your vision and iterate!

### Development Process

1. **Spec Creation** - Used Kiro's spec workflow to define requirements and design
2. **Task Execution** - Kiro broke down the implementation into manageable tasks
3. **Iterative Development** - Made adjustments and improvements through conversation
4. **Deployment Setup** - Configured GitHub Pages with Kiro's help

## 🎨 Technical Details

- **Pure Vanilla JavaScript** - No frameworks, just clean JS
- **HTML5 Canvas** - Smooth 60 FPS rendering
- **CSS3** - Responsive fullscreen layout
- **LocalStorage** - Persistent high scores and preferences
- **Canvas Confetti** - Celebration effects

## 📦 Project Structure

```
flappy-kiro/
├── game-application/
│   ├── index.html          # Main HTML file
│   ├── game.js             # Game logic and rendering
│   ├── style.css           # Fullscreen styling
│   └── kiro-logo.png       # Player sprite
├── .kiro/
│   ├── specs/              # Kiro spec files
│   └── steering/           # Development guidelines
└── README.md               # This file
```

## 🚀 Local Development

1. Clone this repository
2. Open `game-application/index.html` in your browser
3. Start playing!

No build process or dependencies required - it's pure HTML/CSS/JS!

## 🌐 Deploy to GitHub Pages

1. Push this repository to GitHub
2. Go to **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Select **main** branch and **/ (root)** folder
5. Click **Save**
6. Your game will be live at: `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/game-application/`

## 🎓 Learn More About Kiro

- **Website**: [kiro.ai](https://kiro.ai)
- **Documentation**: Learn how to vibecode your own projects
- **Community**: Join other developers building with AI

## 📝 License

This project was created for educational purposes at the Kilkenny AWS Data and AI Conference 2026.

## 🙏 Acknowledgments

- Built with [Kiro AI](https://kiro.ai)
- Presented at Kilkenny AWS Data and AI Conference 2026
- Background music from [Mixkit](https://mixkit.co)
- Confetti effects from [canvas-confetti](https://github.com/catdad/canvas-confetti)

---

**Made with 💜 and AI at Kilkenny AWS Conference 2026**
