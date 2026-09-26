"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlocosService = void 0;
const common_1 = require("@nestjs/common");
let BlocosService = class BlocosService {
    blocos = [
        {
            id: 1,
            codigo: 'BL001',
            material: 'Concreto',
            cor: 'Cinza',
            altura: 20,
            largura: 10,
            comprimento: 30,
            peso: 5,
            dataCadastro: new Date('2023-01-01')
        },
        {
            id: 2,
            codigo: 'BL002',
            material: 'Cerâmica',
            cor: 'Vermelho',
            altura: 15,
            largura: 7,
            comprimento: 25,
            peso: 3,
            dataCadastro: new Date('2023-02-15')
        }
    ];
    criarBloco(dados) {
        const novoId = this.blocos.length > 0
            ? Math.max(...this.blocos.map((b) => b.id)) + 1
            : 1;
        const novoBloco = { id: novoId, ...dados };
        this.blocos.push(novoBloco);
        return novoBloco;
    }
    listas() {
        return this.blocos;
    }
};
exports.BlocosService = BlocosService;
exports.BlocosService = BlocosService = __decorate([
    (0, common_1.Injectable)()
], BlocosService);
//# sourceMappingURL=blocos.service.js.map