import 'dotenv/config';

import { Client, Intents, Collection } from 'discord.js';
import * as fs from 'fs';

const client = new Client({ intents: [Intents.FLAGS.GUILDS] }) as Client;

/**
 * Loads command files
 */
client.commands = new Collection();

const commandFiles = fs
  .readdirSync('./src/commands')
  .filter((file) => file.endsWith('.ts'));

for (const file of commandFiles) {
  const command = require(`./src/commands/${file}`).default;
  client.commands.set(command.data.name, command);
}

/**
 * Loads event files
 */

const eventFiles = fs.readdirSync('./src/events').filter((file) => file.endsWith('.ts'));

for (const file of eventFiles) {
  const event = require(`./src/events/${file}`).default;

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(process.env.DISCORD_BOT_TOKEN);
