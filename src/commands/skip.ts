import { CommandInteraction, SlashCommandBuilder, GuildMember } from "discord.js";
import { useMainPlayer } from "discord-player";

export const data = new SlashCommandBuilder()
  .setName("skip")
  .setDescription("Skips to the next song in the queue");

export async function execute(interaction: CommandInteraction) {
  const player = useMainPlayer();

  const member = interaction.member as GuildMember | null;
  if (!member || !member.voice.channel) {
    return interaction.reply('You are not connected to a voice channel!');
  }

  const queue = player.nodes.get(interaction.guildId!);
  if (!queue || !queue.isPlaying()) {
    return interaction.reply('There is no music currently playing!');
  }

  try {
    const currentTrack = queue.currentTrack;
    queue.node.skip();
    return interaction.reply(`Skipped **${currentTrack?.title}**!`);
  } catch (e) {
    return interaction.reply(`Something went wrong: ${e}`);
  }
}
