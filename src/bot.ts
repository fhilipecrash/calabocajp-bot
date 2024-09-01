import { Client } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands";
import { config } from "./config";
import { Player } from "discord-player";
import { YoutubeiExtractor } from "discord-player-youtubei";

async function startBot() {
  const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages", "GuildVoiceStates"],
  });

  const player = new Player(client);
  await player.extractors.register(YoutubeiExtractor, {
    authentication: config.YOUTUBE_ACCESS_TOKEN
  })

  client.once("ready", async () => {
    console.log("Discord bot is ready! 🤖");
    const guilds = client.guilds.cache.map(guild => guild.id);
    for (const guildId of guilds) {
      await deployCommands({ guildId });
    }
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
