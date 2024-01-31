import {BindingScope, injectable, service} from '@loopback/core/dist';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import { LoginInterface } from '../Core/Interfaces/Login.interface';
import { keys } from '../env/interfaces/ServiceKeys.interface';
import {Credenciales} from '../models/credenciales.model';
import {CredencialesRepository} from '../repositories/credenciales.repository';
import {UsuarioRepository} from '../repositories/usuario.repository';
import { EncriptDecryptService } from './encript-decryot.service';

import {UserService} from "./user.service";
const jsonwebtoken = require('jsonwebtoken');
var shortid = require('shortid-36');


interface token {
  exp: number,
  data: {UserID: number, UserNAME: string, Role: number},
  iat: number
}

@injectable({scope: BindingScope.TRANSIENT})
export class JWTService {
  userService: UserService;
  constructor(
    @repository(CredencialesRepository)
    private credencialesRepository: CredencialesRepository,
    @service(EncriptDecryptService)
    private encriptDecryptService: EncriptDecryptService,
    @repository(UsuarioRepository)
    private usuarioRepository: UsuarioRepository
  ) {
  }


  createToken(credentials: any, user: any) {

    try {
      let token = jsonwebtoken.sign({
        exp: keys.TOKEN_EXPIRATION_TIME,
        data: {
          UserID: credentials.id,
          UserNAME: credentials.username,
          Role: user.rolid
        }
      }, keys.JWT_SECRET_KEY);
      return token;

    } catch (error) {
      console.log("Error al generar el token: ", error);

    }
  }

  VerifyToken(token: string) {
    if (!token)
      throw new HttpErrors[401]("Token vacio")
    let decoded = jsonwebtoken.verify(token, keys.JWT_SECRET_KEY);
    if (decoded)
      return decoded;
    else
      throw new HttpErrors[401]("Token invalido");
  }

  async IdentifyToken(credentials: LoginInterface): Promise<Credenciales | false> {
    let user = await this.credencialesRepository.findOne({where: {correo: credentials.identificator}});

    if (!user)
      user = await this.credencialesRepository.findOne({where: {username: credentials.identificator}});

    if (user?.correo === credentials.identificator || user?.username === credentials.identificator) {
      let cryptPass = await this.encriptDecryptService.Encrypt(credentials.password);
      if (user.hash === cryptPass) {
        return user;
      }
    }
    return false;
  }

  async ResetPassword(identificator: string, newpassword: string): Promise<string | false> {
    let user = await this.credencialesRepository.findOne({where: {correo: identificator}});
    if (!user)
      user = await this.credencialesRepository.findOne({where: {username: identificator}});


    if (user?.correo === identificator || user?.username === identificator) {
      newpassword = this.encriptDecryptService.Encrypt(newpassword);
      user.hash = newpassword;
      this.credencialesRepository.replaceById(user.id, user);

      return newpassword;
    }
    return false;
  }

  async generateCode(userExist: Credenciales) {

  }
}


