import { /* inject, */ BindingScope, injectable, service} from '@loopback/core/dist';
import {repository} from '@loopback/repository';
import { LoginInterface } from '../Core/Interfaces/Login.interface';
import { error } from '../core/Libraries/errors.library';
import {Credenciales} from '../models/credenciales.model';
import { Usuario } from '../models/usuario.model';
import {CredencialesRepository} from '../repositories/credenciales.repository';
import {UsuarioRepository} from '../repositories/usuario.repository';
import {JWTService} from './jwt.service';
import { EncriptDecryptService } from './encript-decryot.service';
import { UsuariosInterface } from '../core/interfaces/Usuarios.Interface';
import { RolesInterface } from '../core/interfaces/roles.interface';
import { post, put } from '@loopback/rest';
var shortid = require('shortid-36');


@injectable({scope: BindingScope.TRANSIENT})
export class AuthService {
  constructor(
    @repository(CredencialesRepository)
    private credencialesRepository: CredencialesRepository,
    @repository(UsuarioRepository)
    private usuarioRepository: UsuarioRepository,
    @service(JWTService)
    private jwtService: JWTService,

    @service(EncriptDecryptService)
    private encriptDecryptService: EncriptDecryptService,

  ) {
  }

  async usuarios(){
    try{
      let datos: Array<UsuariosInterface> = await this.credencialesRepository.dataSource.execute(`spListadoUsuarios`)
      return await datos;
    }
    catch(error){
      console.error('Error al obtener usuarios:', error);
      throw new Error('error al obtener usuarios')
    }
  }

  async roles(){
    try{
      let datos: Array<RolesInterface> = await this.credencialesRepository.dataSource.execute(`spGetRoles`)
      return await datos;
    }
    catch(error){
      console.error('Error al obtener roles: ', error);
      throw new Error('error al obtener usuarios')
    }
  }

  async saveUser(usuario: Usuario){
    try{
      
      await this.usuarioRepository.create(usuario)

      return { message: 'Usuario agregado exitosamente'};
    }
    catch(error){
      console.error("Error al guardar los usuarios", error)
      throw new Error('error al guardar el usuario')
    }
  }

  async saveCred(credenciales: Credenciales):Promise<boolean | any>{
    try{
      if(!credenciales.hash){
        throw new Error("El campo 'hash' en credenciales no puede ser undefined.");
      }
      let modelCredentials = new Credenciales();
      let newHash = this.encriptDecryptService.Encrypt(credenciales.hash);

      modelCredentials.correo = credenciales.correo;
      modelCredentials.username = credenciales.username;
      modelCredentials.hash = newHash;
      modelCredentials.IdRol = credenciales.IdRol
      
      await this.credencialesRepository.create(modelCredentials)

      return { message: 'Credenciales agregado exitosamente'};
    }
    catch(error){
      console.error("Error al guardar los usuarios", error)
      throw new Error('error al guardar el usuario')
    }
  }

  async updateUser(usuario: Usuario) {
    try {
      if (!usuario.id) {
        throw new Error('El usuario no tiene un ID definido.');
      }
  
      await this.usuarioRepository.update(usuario);
      return {message: 'Usuario actualizado correctamente'};
    } catch (error) {
      console.error('Error al actualizar el usuario', error);
      throw new Error('Error al actualizar el usuario');
    }
  }

  async updateCred(credenciales: Credenciales):Promise<boolean | any>{
    try {
      if (!credenciales.id) {
        throw new Error('El usuario no tiene un ID definido.');
      }
      if(!credenciales.hash){
        throw new Error("El campo 'hash' en credenciales no puede ser undefined.");
      }
      let modelCredentials = new Credenciales();
      let newHash = this.encriptDecryptService.Encrypt(credenciales.hash);

      modelCredentials.correo = credenciales.correo;
      modelCredentials.username = credenciales.username;
      modelCredentials.hash = newHash;
      modelCredentials.IdRol = credenciales.IdRol

      console.log(modelCredentials)
      await this.credencialesRepository.update(modelCredentials)
      return {message: 'Usuario actualizado correctamente'};
    } catch (error) {
      console.error('Error al actualizar el usuario', error);
      throw new Error('Error al actualizar el usuario');
    }
  }
  

  async Login(loginInterface: LoginInterface) {

    if (!loginInterface)
      return error.EMTY_CREDENTIALS;

    let credentials = await this.credencialesRepository.findOne({where: {correo: loginInterface.identificator}});

    if (!credentials)
      credentials = await this.credencialesRepository.findOne({where: {username: loginInterface.identificator}});


    if (!credentials)
      return error.CREDENTIALS_NOT_REGISTER;

    let user = await this.usuarioRepository.findOne({where: {correo: credentials.correo}});

    if (!user)
      return error.CREDENTIALS_NOT_REGISTER;


    if (!user.estado)
      return error.DISABLE_USER;

    let matchCredencials = await this.jwtService.IdentifyToken(loginInterface)


    if (!matchCredencials)
      return error.INVALID_PASSWORD;

    const auth = {
      token: await this.jwtService.createToken(matchCredencials, user),
      usuario: JSON.stringify(user),
      rol: credentials.IdRol
    }

    return auth;
  }

  // async RegisterUser(registerUser: RegisterUserInterface): Promise<boolean | any> {
  //   let modelUser: Usuario = new Usuario;
  //   let modelCredentials: Credenciales = new Credenciales;

  //   let userExist = await this.credencialesRepository.findOne({where: {correo: registerUser.email}});

  //   if (userExist)
  //     return error.INVALID_EMAIL;

  //   if (!userExist)
  //     userExist = await this.credencialesRepository.findOne({where: {username: registerUser.username}});

  //   if (userExist)
  //     return error.INVALID_USERNAME;

  //   if (!userExist)
  //     userExist = await this.usuarioRepository.findOne({where: {telefono: registerUser.phoneNumber}});

  //   if (userExist)
  //     return error.INVALID_PHONENUMBER;

  //   modelUser.rolid = registerUser.rolId;
  //   modelUser.nombre = registerUser.firstName;
  //   modelUser.apellido = registerUser.lastName;
  //   modelUser.correo = registerUser.email;
  //   modelUser.estado = true;
  //   modelUser.telefono = registerUser.phoneNumber;

  //   await this.usuarioRepository.create(modelUser);

  //   let newHash = this.encriptDecryptService.Encrypt(registerUser.password);

  //   modelCredentials.correo = registerUser.email;
  //   modelCredentials.username = registerUser.username;
  //   modelCredentials.hash = newHash;

  //   await this.credencialesRepository.create(modelCredentials);

  //   return true;
  // }

  // async createCredentials(credencialShema: credentialShema) {
  //   let modelCredentials: Credenciales = new Credenciales;


  //   let newHash = this.encriptDecryptService.Encrypt(credencialShema.newPassword);

  //   modelCredentials.correo = credencialShema.correo;
  //   modelCredentials.username = credencialShema.username;
  //   modelCredentials.hash = newHash;

  //   await this.credencialesRepository.create(modelCredentials);

  //   return true;
  // }

  // async updateCredencials(credencialShema: credentialShema) {
  //   let modelCredentials: Credenciales = new Credenciales;


  //   let credentialExist = await this.credencialesRepository.findOne({where: {correo: credencialShema.correo}});

  //   if (!credentialExist) {
  //     return false;
  //   }

  //   let newHash = this.encriptDecryptService.Encrypt(credencialShema.newPassword);

  //   modelCredentials.correo = credencialShema.correo;
  //   modelCredentials.username = credencialShema.username;
  //   modelCredentials.hash = newHash;

  //   await this.credencialesRepository.updateById(credentialExist.id, modelCredentials);
    

  //   return true;
  // }



}
