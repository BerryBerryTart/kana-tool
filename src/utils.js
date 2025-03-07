export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export const ALL_OPTION = "ALL";
export const HIRAGANA_OPTION = "h";
export const KATAKANA_OPTION = "k";
