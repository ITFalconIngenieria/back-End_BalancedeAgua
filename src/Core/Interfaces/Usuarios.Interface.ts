export interface UsuariosInterface{
    Nombre:string,
    correo:string,
    username:string,
    nombreRol:string,
    estado:boolean
}

export interface CredencialesInterface{
    Correo:string,
    username:string,
    password:string,
    IdRol:string,
}

export interface NewUserInterface{
    Nombre:string,
    Apellido:string,
    Telefono:string,
    Correo:string,
    IdCredenciales:number,
    Estado:boolean,
    Usuario:string,
    Password:string,
    IdRol:number
}