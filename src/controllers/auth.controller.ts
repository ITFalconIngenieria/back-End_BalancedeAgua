import { repository } from "@loopback/repository";
import { UsuarioRepository } from '../repositories/usuario.repository';
import { CredencialesRepository } from "../repositories/credenciales.repository";
import { service } from "@loopback/core";
import { JWTService } from "../services/jwt.service";
import { AuthService } from '../services/auth.service';
import { post, response, requestBody, get, HttpErrors, getModelSchemaRef, put, param } from "@loopback/rest";
import { LoginInterface } from "../Core/Interfaces/Login.interface";
import { CredencialesInterface, NewUserInterface, UsuariosInterface } from "../core/interfaces/Usuarios.Interface";
import { RolesInterface } from "../core/interfaces/roles.interface";
import { Usuario } from "../models/usuario.model";
import path from 'path';
import { Credenciales } from "../models/credenciales.model";
import { EncriptDecryptService } from '../services/encript-decryot.service';



export class AuthController{
    constructor(
        @repository(UsuarioRepository)
        private usuarioRepository: UsuarioRepository,
        @repository(CredencialesRepository)
        private credencialesRepository:CredencialesRepository,
        @service(JWTService)
        private jwtService: JWTService,
        @service(AuthService)
        private AuthService:AuthService,
        @service(EncriptDecryptService)
        private encriptDecryptService: EncriptDecryptService,

    ){}


    @post('/login')
    @response(200,{
        description:"Usuario model instance"
    })
    async Login(
        @requestBody() loginInterface:LoginInterface
    ):Promise<any>{
        return this.AuthService.Login(loginInterface);
    }

    @get('/usuarios')
    @response(200, {
        description:"Existing user list"
    })
    async Usuarios(
        @requestBody() usuariosInterface:UsuariosInterface
    ):Promise<any>{
        return await this.AuthService.usuarios()
    }

    @get('/roles')
    @response(200,{
        description:"Existing user list"
    })
    async Roles(
        @requestBody()rolesInterface:RolesInterface
    ):Promise<any>{
        return await this.AuthService.roles()
    }

    @post('/saveUser')
    @response(200, {
        description:'User added succesfully',
    })
    async agregarUsuario(
        @requestBody() usuario:Usuario,
    ):Promise<any>{
        return await this.AuthService.saveUser(usuario)
    }

    @post('/saveCred')
    @response(200, {
        description:'credentials added succesfully',
    })
    async agregarCredenciales(
        @requestBody() credenciales:Credenciales,
    ):Promise<any>{
        return await this.AuthService.saveCred(credenciales)
    }

    @put('/updateUser/{id}')
    async updateUsuario(
        @param.path.number('id') id: number,
        @requestBody() usuario: Usuario,
    ): Promise<any> {
        const usuarioExistente = await this.usuarioRepository.findById(id);

        if (!usuarioExistente) {
        throw new HttpErrors.NotFound('Usuario no encontrado');
        }

        const usuarioActualizado = await this.usuarioRepository.updateById(id, usuario);

        return usuarioActualizado;
    }

    @put('/updateCred/{id}')
    async updateCred(
        @param.path.number('id') id: number,
        @requestBody() credenciales: Credenciales,
    ): Promise<any> {
        const credencialExistente = await this.credencialesRepository.findById(id);

        if (!credencialExistente) {
        throw new HttpErrors.NotFound('credencial no encontrado');
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

        const credencialActualizado = await this.credencialesRepository.updateById(id, modelCredentials);

        return credencialActualizado;
    }
    

    
}