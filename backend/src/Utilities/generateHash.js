import bcrypt from "bcryptjs";

const generateHash = async (plainText) => {
  try {
    if (!plainText) {
      throw new Error("Input text is required for hashing");
    }

    const saltRounds = 10;
    const hashedValue = await bcrypt.hash(`${plainText}`, saltRounds);

    return hashedValue;
  } catch (error) {
    throw error;
  }
};

const compareHash = async (plainText, hashedValue) => {
  try {
    if (!plainText || !hashedValue) {
      throw new Error("Both plain text and hash are required for comparison");
    }

    const isMatch = await bcrypt.compare(`${plainText}`, hashedValue);

    return isMatch;
  } catch (error) {
    return false;
  }
};

export { generateHash, compareHash };
