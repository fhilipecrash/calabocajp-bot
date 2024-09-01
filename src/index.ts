import { Client } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands";
import { config } from "./config";
import { Player } from "discord-player";

async function startBot() {
  const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages", "GuildVoiceStates"],
  });

  const player = new Player(client);

  await player.extractors.loadDefault();

  client.once("ready", () => {
    console.log("Discord bot is ready! 🤖");
  });

  client.on("guildCreate", async (guild) => {
    await deployCommands({ guildId: guild.id });
  });

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
      return;
    }
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
      await commands[commandName as keyof typeof commands].execute(interaction);
    }
  });

  player.events.on('playerStart', (queue, track) => {
    queue.metadata.channel.send(`Started playing **${track.title}**!`);
  });

  await client.login(config.DISCORD_TOKEN);
}

// Start the bot
startBot().catch(console.error);
