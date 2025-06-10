import { Pool } from "pg"
import { getDbPool } from "../repositories/pg.connections"

export class WalletService {

  private balance: number
  private database: Pool

  constructor() {
    this.balance = 0
    this.database = getDbPool()
  }


  async deposit(coins: number, userId: number) {
    try {

      let query = `SELECT * FROM wallet WHERE userId = $1`
      const result = await this.database.query(query, [userId])

      if (result.rows.length === 0) {

        console.log("Necessário criar uma wallet para esse user")

        query = `INSERT INTO wallet(userId,balance) VALUES($1,$2)`;
        this.database.query(query, [userId, 0])

        console.log(`wallet do usuario ${userId} foi criado com sucesso!`)


      } else {

        console.log("Pode fazer o update do novo saldo depositado")
        console.log("Getar o saldo antes de inserir o novo valor")

        query = `SELECT balance FROM wallet WHERE userId = $1`
        const balance = await this.database.query(query, [userId])

        const oldBalance: number = balance.rows[0] as number
        const newBalance = coins + oldBalance
        query = `UPDATE wallet SET balance = $1 WHERE userId = $2`
        this.database.query(query, [newBalance, userId])

      }

    } catch (error) {

    }
  }

  consultBalance(): number {
    return 0
  }




}
