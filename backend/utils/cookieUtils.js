const setCookie = (res, name, value, options = {}) => {
  res.cookie(name, value, {
    httpOnly: false,
    secure: false, 
    ...options,
  });
};

const clearCookie = (res, name) => {
  res.clearCookie(name);
};

module.exports = {
  setCookie,
  clearCookie,
};
