require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const nodemailer = require('nodemailer');

const {
  DISCORD_TOKEN,
  GUILD_ID,
  EMAIL_USER,
  EMAIL_PASS,
  TO_EMAIL,
  SMTP_HOST,
  SMTP_PORT
} = process.env;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  if (message.guild.id === GUILD_ID && message.mentions.has(client.user)) {
    const mailOptions = {
      from: EMAIL_USER,
      to: TO_EMAIL,
      subject: `New @mention in ${message.channel.name}`,
      text: `User ${message.author.tag} mentioned in ${message.channel.name}:\n\n${message.content}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Email sent: ' + info.response);
    });
  }
});


client.on('disconnect', () => {
  console.log('Disconnected! Attempting to reconnect...');
  client.login(DISCORD_TOKEN);
});

client.on('reconnecting', () => {
  console.log('Reconnecting...');
});

client.login(DISCORD_TOKEN);