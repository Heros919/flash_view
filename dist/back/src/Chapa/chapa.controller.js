"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapasController = void 0;
const common_1 = require("@nestjs/common");
const criar_chapa_dto_1 = require("./dto/criar-chapa.dto");
const chapa_service_1 = require("./chapa.service");
let ChapasController = class ChapasController {
    chapasService;
    constructor(chapasService) {
        this.chapasService = chapasService;
    }
    criar(body) {
        return this.chapasService.criarChapa(body);
    }
    listar() {
        return this.chapasService.listarChapas();
    }
};
exports.ChapasController = ChapasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [criar_chapa_dto_1.CreateChapas]),
    __metadata("design:returntype", void 0)
], ChapasController.prototype, "criar", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ChapasController.prototype, "listar", null);
exports.ChapasController = ChapasController = __decorate([
    (0, common_1.Controller)('chapas'),
    __metadata("design:paramtypes", [chapa_service_1.ChapasService])
], ChapasController);
//# sourceMappingURL=chapa.controller.js.map