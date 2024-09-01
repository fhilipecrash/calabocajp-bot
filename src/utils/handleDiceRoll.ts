import { Message } from "discord.js";

export function handleDiceRoll(message: Message) {
  if (message.author.bot) return;

  const diceRollRegex = /^(\d*)d(\d+)$/i;
  const content = message.content.trim();
  const match = content.match(diceRollRegex);

  if (!match) return;

  const numberOfRolls = match[1] ? parseInt(match[1], 10) : 1;
  const diceSides = parseInt(match[2], 10);

  if (isNaN(numberOfRolls) || isNaN(diceSides)) {
    return message.reply("Invalid dice roll format.");
  }

  const results: number[] = [];
  for (let i = 0; i < numberOfRolls; i++) {
    results.push(Math.floor(Math.random() * diceSides) + 1);
  }

  const total = results.reduce((sum, roll) => sum + roll, 0);
  const resultMessage = ` \` ${total} \` ⟵ [${results.join(', ')}] ${numberOfRolls}d${diceSides}`;

  return message.reply(resultMessage);
}
