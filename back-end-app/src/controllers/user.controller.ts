
import { UserServices as UserServices } from '../services/user.service';
import UserDTO from '../models/UserDTO';
import { Request, Response } from 'express';

export class UserControllers {

  constructor(private service: UserServices) { }

  helloWolrd = async (_req: Request, resp: Response) => {
    resp.send('Hello, World!');
  };

  //Create new user
  createUser = async (req: Request, resp: Response) => {
    const body = req.body as UserDTO;

    if (!body.name || !body.email || !body.password) {
      resp.send("Name , email or password not defined")
    }

    try {
      const user = await this.service.insertUser(body);
      resp.status(201).json(user)

    } catch (error: unknown) {
      console.error('Error creating user:', error);
      if (error instanceof Error) {
        resp
          .status(400)
          .json({
            "ERROR": error.message
          })
      }
    }

  };

  //Get all users
  geAllUsers = async (_req: Request, resp: Response) => {

    const result: UserDTO[] = await this.service.getAllUsers()

    resp.status(200).json(result)

  }


  // Find user by id
  getUserById = async (req: Request, resp: Response) => {
    const id = parseInt(req.params.id)
    await this.service.getUserById(id).then((user) => {
      if (!user) {
        resp.status(200).send("User not found")
      }
      resp.status(200).json(user)
    }).catch((error) => {
      console.log(`Erro with find id in service ${error}`)
      resp.status(400).send(error)
    })
  }

  // Update user 
  updateUser = async (req: Request, resp: Response) => {

    const id = req.params.id;
    const newUser = req.body as UserDTO;

    try {
      await this.service.updateUser(id, newUser)
      resp.status(200).send("User update sucessefull")
    } catch (error) {
      console.log(`Error with update user ${error}`);
      resp.status(400).send(error)
    }

  };

  //Delete user
  deletUser = async (req: Request, resp: Response) => {
    try {
      const id = req.params.id
      const currentUser = await this.service.getUserById(parseInt(id))
      await this.service.deleteUser(id)
      resp.status(200).send(`
            User:${currentUser?.name}  
            Email:${currentUser?.email} 
            delete sucessefull`)
    } catch (error) {
      console.log("Error with delete user", error)
      resp.status(400).send(error)

    }
  }



}











