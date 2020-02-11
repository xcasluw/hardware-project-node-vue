import jwt from "jsonwebtoken";
import authConfig from "../../config/auth";
import User from "../models/User";

class SessionController {
  async store(req, res) {
    if (!(await req.body.email)) {
      return res.status(400).json({ error: "Email n�o informado" });
    }

    if (!(await req.body.password)) {
      return res.status(400).json({ error: "Senha n�o informada" });
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: "Usu�rio n�o encontrado" });
    }

    if (!(await user.passwordCheck(password))) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    });
  }
}

export default new SessionController();
