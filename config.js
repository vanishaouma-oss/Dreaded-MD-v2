module.exports = {
  prefix: process.env.PREFIX || '.',
  owner: process.env.OWNER_NUMBER || '0',
  botName: process.env.BOT_NAME || 'Dreaded MD v2',
  botVersion: process.env.BOT_VERSION || '2.0.0',
  
  // Features
  features: {
    games: true,
    chatbot: false,
    moderation: true,
    ranking: true,
    antilink: true,
    welcome: true
  },
  
  // Game settings
  games: {
    truth: [
      'What is your biggest secret?',
      'Have you ever lied to your best friend?',
      'What is something you want to do but are afraid to?'
    ],
    dare: [
      'Send a funny selfie',
      'Call someone and sing happy birthday',
      'Type a message backwards'
    ]
  }
};
