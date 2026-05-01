import bcrypt from "bcrypt";

const generateHash = async (plainText) => {
  try {
    // Edge case: if password is empty then throw error
    if (!plainText) {
      throw new Error("Input text is required for hashing");
    }

    const saltRounds = 10;

    // salt generate & hashing (Recommended)
    const hashedValue = await bcrypt.hash(`${plainText}`, saltRounds);

    return hashedValue;
  } catch (error) {
    throw error;
  }
};

const compareHash = async (plainText, hashedValue) => {
  try {
    // Edge case: Input validation
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
