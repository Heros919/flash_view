"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioService = exports.Papel = void 0;
const common_1 = require("@nestjs/common");
var Papel;
(function (Papel) {
    Papel["Funcionario"] = "FUNCIONARIO";
    Papel["Financeiro"] = "FINANCEIRO";
    Papel["Administrador"] = "ADMINISTRADOR";
})(Papel || (exports.Papel = Papel = {}));
let UsuarioService = class UsuarioService {
    usuarios = [
        {
            cpf: 1,
            nome: 'Henrique Luiz Dantas',
            email: 'henrique@empresa.com',
            senhaHash: '$2b$12$1TxO6MRn5RPcoL3AvNGrb.if.HubmYVzI204/nNeXd0zd98N5OEv2',
            ativo: true,
            papel: Papel.Administrador
        },
        {
            cpf: 2,
            nome: 'Claudio Araujo Casta',
            email: 'caraujo@empresa.com',
            senhaHash: '$2b$12$1TxO6MRn5RPcoL3AvNGrb.if.HubmYVzI204/nNeXd0zd98N5OEv2',
            ativo: true,
            papel: Papel.Financeiro
        },
        {
            cpf: 3,
            nome: 'Luiz Conzaga Garcia',
            email: 'conzaga@empresa.com',
            senhaHash: '$2b$12$1TxO6MRn5RPcoL3AvNGrb.if.HubmYVzI204/nNeXd0zd98N5OEv2',
            ativo: true,
            papel: Papel.Funcionario
        }
    ];
    buscarPorEmail(email) {
        const alvo = email.trim().toLowerCase();
        return this.usuarios.find((u) => u.email.toLowerCase() === alvo);
    }
    buscarPorId(cpf) {
        return this.usuarios.find((u) => u.cpf === cpf);
    }
    semSenha(usuario) {
        return {
            cpf: usuario.cpf,
            nome: usuario.nome,
            email: usuario.email,
            ativo: usuario.ativo,
            papel: usuario.papel
        };
    }
};
exports.UsuarioService = UsuarioService;
exports.UsuarioService = UsuarioService = __decorate([
    (0, common_1.Injectable)()
], UsuarioService);
//# sourceMappingURL=usuario.service.js.map