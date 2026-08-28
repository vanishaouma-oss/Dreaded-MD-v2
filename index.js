const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@adiwajshing/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
require('dotenv').config();

const logger = pino();

const PREFIX = process.env.PREFIX || '.';
const PAIR_CODE = process.env.PAIR_CODE;
const SESSION_ID = process.env.dHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkZsTlQ3S0REekZieTRYeXZBVWlVeHBzenV3L1o4eXBRejlzRmlWZ3N5UVZJbVp0ZWk3cm9oSm8yYUFEaDl2MkVibFd6cnI1aFdjVGliMXhXZk5MU0NnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NzYsImFkdlNlY3JldEtleSI6Ikh4Z0hyeFE4eXZIbFFqYmJrdnMyb2N5WFlqVHJCcThDV292ZmZXM2lLQVE9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjoxLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6MSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwicmVnaXN0ZXJlZCI6dHJ1ZSwicGFpcmluZ0NvZGUiOiJCNFozUzRLWiIsIm1lIjp7ImlkIjoiMjU0NzY4MDgyNjk4OjFAcy53aGF0c2FwcC5uZXQiLCJsaWQiOiI3NDM1MDk4NDE3OTcxMzoxQGxpZCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTGlvdU9vRUVOQ0l4ZFFHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiM0l0NlRNLzNObk9YWTFxcVM2U3ptRGlrVmhYU0pkL2p0N1NmTHM4MmhFUT0iLCJhY2NvdW50U2lnbmF0dXJlIjoib3lQZVZLTHJJUnhpRjBxb2hSQnpNNVJ2NmdFQmgxV2dWQlJzWHQ3MmZJQnZyTTkrZ1BhL25GeGxGdkJpZWxRQ0VWT01uUzV0TTJ4bU44dEs4RnV0Qmc9PSIsImRldmljZVNpZ25hdHVyZSI6InF5MCtnZnJPbGthOHdmSXRDOWJTRDJ1aVdGVGpQdmxaVlJJZ2hIaSthMmFYMzdMUzN2MFpUSjZ6RXhUWnpRZDZWalV6aDVwRUJtVWl1WXlVMVhSeEFnPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiNzQzNTA5ODQxNzk3MTM6MUBsaWQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCZHlMZWt6UDl6WnpsMk5hcWt1a3M1ZzRwRllWMGlYZjQ3ZTBueTdQTm9SRSJ9                                    || 'dreaded-session';

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
}

startBot().catch(err => {
  console.error('Bot error:', err);
  process.exit(1);
});

console.log('🚀 Dreaded MD v2 is starting...');
console.log('📱 Pairing site: https://dreaded-pair-site.onrender.com');
console.log('💡 Tip: Set PAIR_CODE in .env to pair without QR code');
