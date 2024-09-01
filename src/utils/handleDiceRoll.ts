import { Message } from "discord.js";

const rollDice = (sides: number) => Math.floor(Math.random() * sides) + 1;

export function handleDiceRoll(message: Message) {
  if (message.author.bot) return;

  const content = message.content.trim();
  
  const complexRollRegex = /^(\d+)#(\d+d\d+)$/i;
  const complexMatch = content.match(complexRollRegex);

  if (complexMatch) {
    const numberOfSets = parseInt(complexMatch[1], 10);
    const basicRollPart = complexMatch[2];
    
    const basicMatch = basicRollPart.match(/^(\d*)d(\d+)$/i);
    if (!basicMatch) return message.reply("Invalid dice roll format.");
    
    const diceMultiplicator = basicMatch[1] ? parseInt(basicMatch[1], 10) : 1;
    const diceSides = parseInt(basicMatch[2], 10);
    
    let resultMessages: string[] = [];
    for (let i = 0; i < numberOfSets; i++) {
      const setResults: number[] = [];
      for (let j = 0; j < diceMultiplicator; j++) {
        setResults.push(rollDice(diceSides));
      }
      const setTotal = setResults.reduce((sum, roll) => sum + roll, 0);
      resultMessages.push(`\` ${setTotal} \` ⟵ [${setResults.join(', ')}] ${diceMultiplicator}d${diceSides}`);
    }
    
    const resultMessage = resultMessages.join('\n');
    return message.reply(resultMessage);
  }

  const singleDieSimultaneousRegex = /^(\d+)#d(\d+)$/i;
  const singleDieMatch = content.match(singleDieSimultaneousRegex);

  if (singleDieMatch) {
    const numberOfRolls = parseInt(singleDieMatch[1], 10);
    const diceSides = parseInt(singleDieMatch[2], 10);

    if (isNaN(numberOfRolls) || isNaN(diceSides)) {
      return message.reply("Invalid dice roll format.");
    }

    const results: number[] = [];
    for (let i = 0; i < numberOfRolls; i++) {
      results.push(rollDice(diceSides));
    }

    const total = results.reduce((sum, roll) => sum + roll, 0);
    const resultMessage = ` \` ${total} \` ⟵ [${results.join(', ')}] ${numberOfRolls}#d${diceSides}`;

    return message.reply(resultMessage);
  }

  const diceRollRegex = /^(\d*)d(\d+)$/i;
  const match = content.match(diceRollRegex);

  if (!match) return;

  const numberOfRolls = match[1] ? parseInt(match[1], 10) : 1;
  const diceSides = parseInt(match[2], 10);

  if (isNaN(numberOfRolls) || isNaN(diceSides)) {
    return message.reply("Invalid dice roll format.");
  }

  const results: number[] = [];
  for (let i = 0; i < numberOfRolls; i++) {
    results.push(rollDice(diceSides));
  }

  const total = results.reduce((sum, roll) => sum + roll, 0);
  const resultMessage = ` \` ${total} \` ⟵ [${results.join(', ')}] ${numberOfRolls}d${diceSides}`;

  return message.reply(resultMessage);
}
