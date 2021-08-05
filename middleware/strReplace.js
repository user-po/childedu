module.exports = (str, index, char) => {
  const strAry = str.split("");
  strAry[index] = char;
  return strAry.join("");
};
