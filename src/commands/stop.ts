import { CommandInteraction, SlashCommandBuilder, GuildMember } from "discord.js";
import { useMainPlayer } from "discord-player";

export const data = new SlashCommandBuilder()
  .setName("stop")
  .setDescription("Stops the music and clears the queue");

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
    queue.delete();
    return interaction.reply('Music stopped and queue cleared!');
  } catch (e) {
    return interaction.reply(`Something went wrong: ${e}`);
  }
}
