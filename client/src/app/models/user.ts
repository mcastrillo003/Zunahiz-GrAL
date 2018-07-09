export class User{

  constructor(
    public _id: string,
    public username: String,
    public firstName: String,
    public lastName: String,
    public lastName2: String,
    public description: String,
    public portada: String,
    public salt: String,//is a string of characters unique to each user.
    public hash: String,//is created by combining the password provided by the user and the salt, and then applying one-way encryption
    public argazkia: String // Image
  ){}
}
