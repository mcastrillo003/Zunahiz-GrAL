export class Publication{

  constructor(
    public _id: String,
    public izenburua: String,
    public iruzkinak: String[],
    public azalpena: String,
    public mota: String,
    public sortzailea: String,
    public urtea: String,
    public hilabetea: String,//is a string of characters unique to each user.
    public eguna: String,//is created by combining the password provided by the user and the salt, and then applying one-way encryption
    public noizkoUrtea:String,
    public noizkoHilabetea:String,
    public noizkoEguna:String,
    public noizko:String,
    public data:String,
    public file:String,
    public gustuko: String[],
    public duty:String,
    public semaforoak:String[]
  ){}
}
