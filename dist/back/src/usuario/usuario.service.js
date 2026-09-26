"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioService = void 0;
const common_1 = require("@nestjs/common");
let UsuarioService = class UsuarioService {
    usuario = [
        {
            id: 1,
            nome: 'Henrique Luiz Dantas',
            email: 'henrique@empresa.com',
            senha: '$2b$12$1TxO6MRn5RPcoL3AvNGrb.if.HubmYVzI204/nNeXd0zd98N5OEv2',
            ativo: true,
            papel: 'Adiministrador'
        },
        {
            id: 2,
            nome: 'Claudio Araujo Casta',
            email: 'caraujo@empresa.com',
            senha: '123456',
            ativo: true,
            papel: 'Financeiro'
        },
        {
            id: 3,
            nome: 'Luiz Conzaga Garcia',
            email: 'conzaga@empresa.com',
            senha: '123456',
            ativo: true,
            papel: 'Funcionario'
        }
    ];
    buscarporemail(email) {
        return this.usuario.find((u) => u.email === email);
    }
};
exports.UsuarioService = UsuarioService;
exports.UsuarioService = UsuarioService = __decorate([
    (0, common_1.Injectable)()
], UsuarioService);
//# sourceMappingURL=usuario.service.js.map