import User from "../models/User";
import * as Yup from "yup";

class UserController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const users = await User.findAll({
      attributes: ["id", "name", "email"],
      limit: 20,
      offset: (page - 1) * 20
    });
    return res.json({ users });
  }
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Email inv�lido" });
    }

    if (!(await req.body)) {
      return res.status(400).json({ error: "Os dados s�o inv�lidos" });
    }

    if (!(await req.body.name)) {
      return res.status(400).json({ error: "Nome n�o informado" });
    }

    if (!(await req.body.email)) {
      return res.status(400).json({ error: "Email n�o informado" });
    }

    if (!(await req.body.password)) {
      return res.status(400).json({ error: "Senha n�o informada" });
    }

    const userExists = await User.findOne({
      where: { email: req.body.email }
    });

    if (userExists) {
      return res.status(400).json({ error: "Email j� existe" });
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({
      id,
      name,
      email
    });
  }
  async update(req, res) {
    if (!(await req.body.email)) {
      return res.status(400).json({ error: "Nenhum email informado" });
    }

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when("oldPassword", (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when("password", (password, field) =>
        password ? field.required().oneOf([Yup.ref("password")]) : field
      )
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Os dados s�o inv�lidos" });
    }
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email != user.email) {
      const userExists = await User.findOne({
        where: { email }
      });
      if (userExists) {
        return res.status(400).json({ error: "O email j� est� em uso" });
      }
    }

    if (oldPassword && !(await user.passwordCheck(oldPassword))) {
      return res.status(401).json({ error: "As senhas s�o diferentes" });
    }

    const { id, name } = await user.update(req.body);

    return res.json({
      id,
      name,
      email
    });
  }
}

export default new UserController();
