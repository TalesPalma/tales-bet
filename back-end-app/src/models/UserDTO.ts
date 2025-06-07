interface UserDTO {
  id?: number;
  name: string;
  email: string;
  password?: string; // Senha pode ser opcional para evitar exposição
  createdAt?: Date;
  updatedAt?: Date;
}

export default UserDTO;
