import { Response } from "express";
import { UserDTO } from "../dtos/UserDTO";
import { User } from "../models/User";
import { UserRepository } from "../repositories/UserRepository";
import { Logger } from "../utils/Logger";

const LOG = new Logger("UserService.class");
const userRepository = new UserRepository();

export class UserService {

    public async getUsers(res: Response) {
        const users = await userRepository.findAll();
        LOG.debug("users", users);
        return res.sendStatus(200).send(users);
    }

    public async getUser(res: Response, userId: number) {
        const user = await userRepository.findById(userId);
        LOG.debug("user", user);
        return res.sendStatus(200).send(user);
    }

    public async createUser(res: Response, user: UserDTO) {
        LOG.debug("userDTO", user);

        const newUser = new User();
        newUser.bio = user.bio;
        newUser.name = user.name;
        newUser.lastname = user.lastname;
        newUser.email = user.email;
        newUser.birthday = user.birthday;

        const userInserted = await userRepository.save(newUser);
        LOG.debug("newUserId ", userInserted.insertId);
        return res.sendStatus(200).send(userInserted);
    }

    public async updateUser(res: Response, userDto: UserDTO) {
        LOG.debug("userDTO", userDto);

        const user = await userRepository.findById(userDto.id);
        user.bio = userDto.bio;
        user.name = userDto.name;
        user.lastname = userDto.lastname;
        user.email = userDto.email;
        user.birthday = userDto.birthday;

        const userUpdated = await userRepository.update(user);
        LOG.debug("userUpdated ", userUpdated);
        return res.sendStatus(200).send(userUpdated);
    }
}