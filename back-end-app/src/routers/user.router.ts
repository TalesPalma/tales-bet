import { Router } from "express";
import { UserControllers } from "../controllers/user.controller"
import { UserServices } from "../services/user.service";

export class UserRouters {


  public router: Router;
  public controller: UserControllers;


  constructor() {
    this.router = Router();

    const userService = new UserServices();
    this.controller = new UserControllers(userService)
    this.registerRouters()

  }

  private registerRouters() {

    //gets
    this.router.get('/', this.controller.helloWolrd)
    this.router.get('/user', this.controller.geAllUsers)
    this.router.get('/user/:id', this.controller.getUserById)


    //Posts\
    this.router.post('/user', this.controller.createUser)

    //Updates
    this.router.put('/user/:id', this.controller.updateUser)

    //Deletes
    this.router.delete('/user/:id', this.controller.updateUser)


  }




}
