"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapasService = void 0;
const common_1 = require("@nestjs/common");
let ChapasService = class ChapasService {
    chapas = [];
    criarChapas(dados) {
        const novoId = this.chapas.length > 0
            ? Math.max(...this.chapas.map((c) => c.id)) + 1
            : 1;
        const novaChapa = {
            id: novoId,
            ...dados,
            dataCadastro: new Date()
        };
        this.chapas.push(novaChapa);
        return novaChapa;
    }
    listar() {
        return this.chapas;
    }
};
exports.ChapasService = ChapasService;
exports.ChapasService = ChapasService = __decorate([
    (0, common_1.Injectable)()
], ChapasService);
//# sourceMappingURL=chapas.service.js.map