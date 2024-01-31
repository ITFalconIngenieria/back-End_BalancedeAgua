import { DefaultCrudRepository } from "@loopback/repository";
import { Usuario, UsuarioRelations } from "../models/usuario.model";
import { inject } from "@loopback/core";
import { BalanceAguaDataSource } from "../datasources";

export class UsuarioRepository extends DefaultCrudRepository<
    Usuario,
    typeof Usuario.prototype.id,
    UsuarioRelations
>{
    constructor(
        @inject('datasources.BalanceAgua') dataSource:BalanceAguaDataSource,
    ){
        super(Usuario, dataSource)
    }
}
