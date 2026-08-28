const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@adiwajshing/baileys');
const pino = require('pino');
require('dotenv').config();

const logger = pino();

const PREFIX = process.env.PREFIX || '.';
const SESSION_ID = process.env.SESSION_ID || 'default_session';

// Game commands
const commands = {
  truth: () => {
    const truths = [
      'What is your biggest secret?',
      'Have you ever lied to your best friend?',
      'What is something you want to do but are afraid to?',
      'Who do you have a crush on?',
      'What is your most embarrassing moment?'
    ];
    return 'Truth 🤔: ' + truths[Math.floor(Math.random() * truths.length)];
  },
  dare: () => {
    const dares = [
      'Send a funny selfie',
      'Call someone and sing happy birthday',
      'Type a message backwards',
      'Do 10 pushups and send a photo',
      'Send your crush a funny meme'
    ];
    return 'Dare 🎯: ' + dares[Math.floor(Math.random() * dares.length)];
  },
  toss: () => Math.random() > 0.5 ? 'Heads! 🪙' : 'Tails! 🪙',
  pick: (args) => args.length > 0 ? `I pick: ${args[Math.floor(Math.random() * args.length)]} 🎲` : 'No options provided!',
  wordchain: () => 'Word Chain started! Send words that start with the last letter! 📝\nExample: CAT → TREE → EAGLE',
  quiz: () => 'Quiz started! 🧠\nQuestion: What is 2+2?\nA) 3\nB) 4\nC) 5',
  rank: () => 'Your rank: Gold⭐⭐⭐\nLevel: 15',
  leaderboard: () => '🏆 TOP PLAYERS:\n1. Player1 - 5000 XP ⭐\n2. Player2 - 4500 XP ⭐\n3. Player3 - 4000 XP ⭐\n4. Player4 - 3500 XP\n5. Player5 - 3000 XP',
  alive: () => '✅ Bot is alive and working!\nVersion: 2.0.0 (Benedict)\nStatus: Online 🟢',
  ping: () => `🏓 Pong! Latency: ${Math.floor(Math.random() * 100) + 20}ms`,
  xp: () => 'Your XP: 2500 ✨\nNext Level in: 500 XP',
  help: () => `
╔═══════════════════════════════╗
║  BENEDICT MD v2 - COMMANDS    ║
╠═══════════════════════════════╣
║ 🎮 GAMES                      ║
║ ${PREFIX}truth - Truth game          ║
║ ${PREFIX}dare - Dare challenge       ║
║ ${PREFIX}toss - Coin toss            ║
║ ${PREFIX}pick <opt1> <opt2> - Picker║
║ ${PREFIX}wordchain - Word game       ║
║ ${PREFIX}quiz - Quiz challenge       ║
║                               ║
║ 📊 RANKING                    ║
║ ${PREFIX}rank - Your rank            ║
║ ${PREFIX}leaderboard - Top 10        ║
║ ${PREFIX}xp - Your XP               ║
║                               ║
║ ℹ️ INFO                       ║
║ ${PREFIX}alive - Bot status          ║
║ ${PREFIX}ping - Latency              ║
║ ${PREFIX}help - This menu            ║
║                               ║
║ Made with ❤️ by Vanisha        ║
╚═══════════════════════════════╝
`
};

async function startBot() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_' + SESSION_ID);
    
    const sock = makeWASocket({
      auth: state,
      logger: pino({ level: 'silent' }),
      printQRInTerminal: true // Always show QR in terminal
    });

    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update;
      
      // Show QR code if needed
      if (qr) {
        console.log('\n📱 SCAN THIS QR CODE WITH WHATSAPP\n');
      }
      
      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log('⚠️ Connection closed. Reconnecting...', shouldReconnect);
        if (shouldReconnect) {
          setTimeout(() => startBot(), 5000);
        }
      } else if (connection === 'open') {
        console.log('✅ Bot connected successfully!');
        console.log('📱 Ready to receive commands');
      }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
      try {
        const message = m.messages[0];
        if (!message.message) return;

        const text = message.message.conversation || message.message.extendedTextMessage?.text || '';
        const sender = message.key.remoteJid;
        const isCmd = text.startsWith(PREFIX);

        if (isCmd) {
          const cmd = text.slice(PREFIX.length).split(' ')[0].toLowerCase();
          const args = text.slice(PREFIX.length).split(' ').slice(1);
          
          let response = commands[cmd] ? commands[cmd](args) : `❌ Command not found!\nType ${PREFIX}help for all commands`;
          
          await sock.sendMessage(sender, { text: response });
          console.log(`✅ Command: ${cmd} | From: ${sender}`);
        }
      } catch (error) {
        console.error('Message processing error:', error);
      }
    });

  } catch (err) {
    console.error('❌ Bot error:', err.message);
    setTimeout(() => startBot(), 5000); // Retry after 5 seconds
  }
}

console.log('🚀 Benedict MD v2 is starting...');
console.log('📱 Waiting for QR code...');
console.log('💡 Make sure you have a WhatsApp account ready');
console.log('⏳ Initializing bot...\n');

startBot();
