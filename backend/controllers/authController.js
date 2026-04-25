import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    const user = { id: "demoUser" };

    const token = jwt.sign(user, process.env.JWT_SECRET);
    res.json({ token });
};