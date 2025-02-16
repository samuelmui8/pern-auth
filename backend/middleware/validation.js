module.exports = (req, res, next) => {
  const {
    username,
    password,
    nric,
    first_name,
    last_name,
    dob,
    address,
    gender,
  } = req.body;

  if (req.path === "/register") {
    if (
      ![
        username,
        password,
        nric,
        first_name,
        last_name,
        dob,
        address,
        gender,
      ].every(Boolean)
    ) {
      return res.status(401).json({ message: "Missing Input" });
    }
    // check nric validity
    if (!/^[STFG]\d{7}[A-Z]$/.test(nric)) {
      return res.status(401).json({ message: "Invalid NRIC" });
    }
  }

  if (req.path === "/login") {
    if (![username, password].every(Boolean)) {
      return res.status(401).json({ message: "Missing Input" });
    }
  }

  next();
};
