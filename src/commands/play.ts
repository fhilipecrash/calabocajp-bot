import { CommandInteraction, SlashCommandBuilder, GuildMember } from "discord.js";
import { useMainPlayer } from "discord-player";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Plays YouTube music")
  .addStringOption(option => 
    option.setName('query')
        .setDescription('Enter a music name')
        .setRequired(true));

export async function execute(interaction: CommandInteraction) {
  const player = useMainPlayer();

  const member = interaction.member as GuildMember | null;
  if (!member || !member.voice.channel) {
    return interaction.reply('You are not connected to a voice channel!');
  }

  const query = interaction.options.get('query')?.value as string | null;
  if (!query) {
    return interaction.reply('No query provided!');
  }

  await interaction.deferReply();

  try {
    const { track } = await player.play(member.voice.channel, query, {
      searchEngine: 'youtubeSearch',
      nodeOptions: {
        metadata: interaction
      },
    });

    return interaction.followUp(`**${track.title}** enqueued!`);
  } catch (e) {
    return interaction.followUp(`Something went wrong: ${e}`);
  }
}
