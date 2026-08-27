# Dreaded MD v2 🤖

A powerful WhatsApp bot with games, moderation, and entertainment commands.

## Features

✨ **Games & Entertainment**
- `.truth` - Truth or Dare game
- `.dare` - Dare challenges
- `.toss` - Coin toss
- `.pick` - Random picker
- `.wordchain` - Word chain game
- `.quiz` - Quiz challenges

📊 **User Engagement**
- `.rank` - Check user rank
- `.leaderboard` - View XP leaderboard
- `.chatbot on` - Enable AI chatbot

🛡️ **Moderation**
- `.antilink on` - Prevent link spam
- `.welcome on` - Welcome new members
- `.mute` - Mute users
- `.unmute` - Unmute users

## Setup Instructions

### 1. Get Pair Code
- Visit: [dreaded-pair-site.onrender.com](https://dreaded-pair-site.onrender.com)
- Enter your BOT WhatsApp number (not your main account)
- Get the 8-digit code
- Link on WhatsApp

### 2. Host for FREE
- Go to [Katabump.com](https://Katabump.com) or [Render.com](https://render.com)
- Upload this repo or connect GitHub
- Set environment variables:
  - `PAIR_CODE` - Your 8-digit code from step 1
  - `SESSION_ID` - Auto-generated after first run
- Start the server

### 3. Add to Luna Eclipse
- Make the bot an admin in your WhatsApp group
- Type `.alive` or `.menu` to test
- Start using commands!

## Environment Variables

```env
PAIR_CODE=your_8_digit_code
SESSION_ID=will_be_auto_generated
PREFIX=.
OWNER_NUMBER=your_number
```

## Installation

```bash
git clone https://github.com/vanishaouma-oss/Dreaded-MD-v2
cd Dreaded-MD-v2
npm install
node index.js
```

## Commands

### Games
| Command | Description |
|---------|-------------|
| `.truth` | Play truth game |
| `.dare` | Accept a dare |
| `.toss` | Flip a coin |
| `.pick <options>` | Pick random option |
| `.wordchain` | Start word chain |
| `.quiz` | Start quiz |

### Ranking
| Command | Description |
|---------|-------------|
| `.rank` | Check your rank |
| `.leaderboard` | Top players |
| `.xp` | Check XP |

### Moderation
| Command | Description |
|---------|-------------|
| `.antilink on/off` | Toggle link blocking |
| `.welcome on/off` | Toggle welcome message |
| `.chatbot on/off` | Toggle AI chatbot |

### Utilities
| Command | Description |
|---------|-------------|
| `.alive` | Check bot status |
| `.menu` | Show all commands |
| `.ping` | Check latency |

## License

MIT License - Feel free to use and modify!

## Support

For issues and support, visit our pairing site or create an issue in this repository.

---

**Made with ❤️ by Dreaded Community**
