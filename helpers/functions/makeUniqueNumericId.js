export const makeUniqueNumericId = (length) => {
  let result = "";
  const characters = "123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return Number(result);
};
