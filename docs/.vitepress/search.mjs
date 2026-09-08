// Use the same tokenizer when building the index and searching in the browser.
export function tokenize(text) {
  const tokens = text.toLowerCase().match(/[\p{Script=Han}]+|[\p{L}\p{N}_]+/gu) ?? []
  return tokens.flatMap((token) => {
    if (!/\p{Script=Han}/u.test(token) || token.length < 2) return [token]
    return Array.from(token, (_, index) => token.slice(index, index + 2)).filter((part) => part.length === 2)
  })
}
