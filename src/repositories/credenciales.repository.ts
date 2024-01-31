import { DefaultCrudRepository } from "@loopback/repository";
import { Credenciales, CredencialesRelations } from "../models/credenciales.model";
import { inject } from "@loopback/core";
import { BalanceAguaDataSource } from "../datasources";

export class CredencialesRepository extends DefaultCrudRepository<
    Credenciales,
    typeof Credenciales.prototype.id,
    CredencialesRelations
>{
    constructor(
        @inject('datasources.BalanceAgua') dataSource:BalanceAguaDataSource,
    ){
        super(Credenciales, dataSource)
    }
}
