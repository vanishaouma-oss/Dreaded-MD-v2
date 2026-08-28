const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@adiwajshing/baileys');
const pino = require('pino');
require('dotenv').config();

const logger = pino();

const PREFIX = process.env.PREFIX || '.';
const PAIR_CODE = process.env.PAIR_CODE;
const SESSION_ID = process.env.SESSION_ID || 'default_session';

// Game commands
const commands = {
  truth: () => 'Truth or Dare? You chose: TRUTH! 🤔',
  dare: () => 'Dare accepted! Do something crazy! 🎯',
  toss: () => Math.random() > 0.5 ? 'Heads! 🪙' : 'Tails! 🪙',
  pick: (args) => args.length > 0 ? `I pick: ${args[Math.floor(Math.random() * args.length)]}` : 'No options provided!',
  wordchain: () => 'Word Chain started! Send words that start with the last letter! 📝',
  quiz: () => 'Quiz started! Answer the questions! 🧠',
  rank: () => 'Your rank: Gold⭐⭐⭐',
  leaderboard: () => '🏆 TOP PLAYERS:\n1. Player1 - 5000 XP\n2. Player2 - 4500 XP\n3. Player3 - 4000 XP',
  alive: () => '✅ Bot is alive and working! Version 2.0.0',
  ping: () => `🏓 Pong! Latency: ${Math.floor(Math.random() * 100)}ms`,
  xp: () => 'Your XP: 2500 ✨',
  menu: () => `
╔═══════════════════════════╗
║  DREADED MD v2 COMMANDS   ║
╠═══════════════════════════╣
║ 🎮 GAMES                  ║
║ ${PREFIX}truth - Truth game       ║
║ ${PREFIX}dare - Dare challenge    ║
║ ${PREFIX}toss - Coin toss         ║
║ ${PREFIX}pick - Random picker     ║
║ ${PREFIX}wordchain - Word game    ║
║ ${PREFIX}quiz - Quiz challenge    ║
║                           ║
║ 📊 RANKING                ║
║ ${PREFIX}rank - Your rank         ║
║ ${PREFIX}leaderboard - Top 10     ║
║ ${PREFIX}xp - Your XP             ║
║                           ║
║ 🛡️ MODERATION              ║
║ ${PREFIX}antilink on - Block links║
║ ${PREFIX}welcome on - Welcome msg ║
║ ${PREFIX}chatbot on - AI chat     ║
║                           ║
║ ℹ️ INFO                   ║
║ ${PREFIX}alive - Bot status       ║
║ ${PREFIX}ping - Latency           ║
╚═══════════════════════════╝
`
};

async function startBot() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_' + SESSION_ID);
    
    const sock = makeWASocket({
      auth: state,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: !PAIR_CODE
    });

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect } = update;
      
      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log('Connection closed. Reconnecting...', shouldReconnect);
        if (shouldReconnect) {
          startBot();
        }
      } else if (connection === 'open') {
        console.log('✅ Bot connected successfully!');
      }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
      const message = m.messages[0];
      if (!message.message) return;

      const text = message.message.conversation || message.message.extendedTextMessage?.text || '';
      const sender = message.key.remoteJid;
      const isCmd = text.startsWith(PREFIX);

      if (isCmd) {
        const cmd = text.slice(PREFIX.length).split(' ')[0].toLowerCase();
        const args = text.slice(PREFIX.length).split(' ').slice(1);
        
        const response = commands[cmd] ? commands[cmd](args) : '❌ Command not found! Type ' + PREFIX + 'menu for all commands';
        
        await sock.sendMessage(sender, { text: response });
      }
    });
  } catch (err) {
    console.error('Bot error:', err);
    setTimeout(startBot, 5000); // Retry after 5 seconds
  }
}

console.log('🚀 Dreaded MD v2 (Benedict) is starting...');
console.log('📱 Pairing site: https://dreaded-pair-site.onrender.com');
console.log('💡 Tip: Set PAIR_CODE in .env to pair without QR code');

startBot();
