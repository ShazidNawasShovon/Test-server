module.exports.generateCode = (code, count, length = 4) => {
  count = "" + (count + 1);
  let number = "";
  for (let i = 0; i < length - count.length; i++) {
    number += "0";
  }
  return code + "-" + number + count;
};
