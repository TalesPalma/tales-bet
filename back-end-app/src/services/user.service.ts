import { Pool } from "pg";
import { getDbPool } from "../repositories/pg.connections";
import UserDTO from "../models/UserDTO";
import UserDAO from "../models/UserDAO";



export class UserServices {

  database: Pool;


  constructor() {
    this.database = getDbPool();
  }

  //Verificar se não vai dar error de tentar inserir um email que já existe no banco.
  async insertUser(user: UserDTO): Promise<UserDTO> {

    console.log(user)

    if (!user.name.trim() || !user.email.trim() || !user.password?.trim()) {
      return Promise.reject(new Error("Caiu aqui Name, email, and password are required"));
    }

    //Verify is user email is not exist before try insert new user in database
    const emailCheck = await this.database.query(`SELECT * FROM users WHERE email=$1`, [user.email])
    if (emailCheck.rows.length > 0) {
      throw new Error("EMAIL IS ALREADY IN USER FOR ANOTHER USER")
    }


    const query = `INSERT INTO users (name,email,password) VALUES ($1, $2, $3)`;
    const values = [
      user.name,
      user.email,
      user.password,
    ];
    return this.database.query(query, values)
      .then(() => {
        return user;
      })
      .catch((error) => {
        console.error("Error inserting user:", error);
        throw new Error("Failed to insert user");
      });
  }

  async getUserById(id: number): Promise<UserDTO | null> {

    // Logic to retrieve a user by ID
    const query = `SELECT * FROM users WHERE id = $1`;
    const values = [id];
    return this.database.query(query, values)
      .then((result) => {
        if (result.rows.length === 0) {
          return null; // User not found
        }
        return Promise.resolve(result.rows[0] as UserDTO);
      }).catch((error) => {
        console.error("Error retrieving user by ID:", error);
        return Promise.reject(new Error("Failed to retrieve user"));
      });
  }

  async getAllUsers(): Promise<UserDAO[]> {
    // Logic to retrieve all users
    const query = `SELECT * FROM users`;

    const result = await this.database.query(query);
    if (result.rows.length === 0) {
      return []; // No users found
    }

    return result.rows.map((row: UserDAO) => {
      return {
        id: row.id,
        name: row.name,
        email: row.email,
        password: row.password, // Password should be handled carefully in production
        createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
        updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
      } as UserDAO;
    });
  }


  async updateUser(id: string, user: UserDTO): Promise<UserDTO | null> {

    //Select current user
    const selectCurrentUser = await this.database.query(`SELECT * FROM users WHERE id=$1`, [id]);
    const currentUser: UserDAO = selectCurrentUser.rows[0];


    if (user.email) {
      const emailCheck = await this.database.query(`
    SELECT * FROM users WHERE email=$1 AND id!=$2
`, [id, user.email])

      if (emailCheck.rows.length > 0) {
        throw new Error("Email is already in user by another user");
      }

    }




    const userUpdate: UserDTO = {
      name: user.name ? user.name : currentUser.name,
      email: user.email ? user.email : currentUser.email,
      password: user.password ? user.password : currentUser.password
    }


    //Update
    const query = `UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 returning *`
    const values = {
      name: userUpdate.name,
      email: userUpdate.email,
      password: userUpdate.password,
      id: id
    }
    this.database.query(query, Object.values(values))
    return Promise.resolve(null); // Placeholder implementation
  }

  async deleteUser(id: string): Promise<boolean> {
    const query = `DELETE FROM users WHERE id = $1`;
    this.database.query(query, [id])
    return Promise.resolve(true); // Placeholder implementation
  }






}
