import { Message } from "discord.js";

// Function to roll a single die
const rollDice = (sides: number) => Math.floor(Math.random() * sides) + 1;

// Function to format the results, applying strikethrough to the first lowest value and bold to the highest value
const formatResults = (results: number[]) => {
  const sortedResults = [...results].sort((a, b) => a - b);
  // const minValue = sortedResults[0];
  const maxValue = sortedResults[sortedResults.length - 1];

  // let minStriked = false;
  let maxBolded = false;

  const formattedResults = results.map(roll => {
    // if (!minStriked && roll === minValue) {
    //   minStriked = true;
    //   return `~~${roll}~~`; // Apply strikethrough to the first occurrence of the lowest value
    // }
    if (!maxBolded && roll === maxValue) {
      maxBolded = true;
      return `**${roll}**`; // Bold the first occurrence of the highest value
    } else {
      return `${roll}`;
    }
  });

  return formattedResults;
};

// Function to handle basic and complex dice roll formats
export function handleDiceRoll(message: Message) {
  if (message.author.bot) return;

  const content = message.content.trim();

  // Regex for complex rolls, e.g., 5#6d4
  const complexRollRegex = /^(\d+)#(\d+d\d+)$/i;
  const complexMatch = content.match(complexRollRegex);

  if (complexMatch) {
    const numberOfSets = parseInt(complexMatch[1], 10);
    const basicRollPart = complexMatch[2];
    
    // Process the basic roll part
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
      const formattedResults = formatResults(setResults);
      const setTotal = setResults.reduce((sum, roll) => sum + roll, 0);
      const resultMessage = `\` ${setTotal} \` ⟵ [${formattedResults.join(', ')}] ${diceMultiplicator}d${diceSides}`;
      
      resultMessages.push(resultMessage);
    }
    
    // Join the result messages for all sets
    const resultMessage = resultMessages.join('\n');
    return message.reply(resultMessage);
  }

  // Regex for simultaneous single die rolls, e.g., 5#d4
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

    const formattedResults = formatResults(results);
    const total = results.reduce((sum, roll) => sum + roll, 0);
    const resultMessage = ` \` ${total} \` ⟵ [${formattedResults.join(', ')}] ${numberOfRolls}#d${diceSides}`;

    return message.reply(resultMessage);
  }

  // Regex for basic dice rolls, e.g., d20 or 5d8
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

  const formattedResults = formatResults(results);
  const total = results.reduce((sum, roll) => sum + roll, 0);
  const resultMessage = ` \` ${total} \` ⟵ [${formattedResults.join(', ')}] ${numberOfRolls}d${diceSides}`;

  return message.reply(resultMessage);
}
