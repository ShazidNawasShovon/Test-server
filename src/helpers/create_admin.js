const Users = require("../models/Users");
const hash = require("./password_hash");

//create user
(async () => {
  try {
    const admin = await Users.findOne({ email: "admin@gmail.com" });
    if (!admin) {
      const hashPass = await hash.new("123456");
      const userInfo = {
        name: "Admin",
        email: "admin@gmail.com",
        password: hashPass,
        phone_number: "018149404040",
        role: "admin",
      };
      await Users.create(userInfo);
      console.log("admin user created");
      return;
    } else {
      console.log("admin already exists");
      return;
    }
  } catch (error) {
    console.error("admin user create failed", error);
  }
})();
