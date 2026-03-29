export const stripEmojis = (text: string): string => {
  if (!text) return '';

  return text
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
    .replace(/[\uFE0F\u200D]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

export default { stripEmojis };
