export const getMessageBasedOnCode = (code, message) => {
    return code === 0
        ? `${message} succeeded!`
        : code === 1
          ? `${message} failed!`
          : `${message} exited with code ${code}`;
};
