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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatChapas = exports.StatusChapas = void 0;
const class_validator_1 = require("class-validator");
var StatusChapas;
(function (StatusChapas) {
    StatusChapas["DISPONIVEL"] = "disponivel";
    StatusChapas["RESERVADO"] = "reservado";
    StatusChapas["VENDIDO"] = "vendido";
})(StatusChapas || (exports.StatusChapas = StatusChapas = {}));
class CreatChapas {
    codigo;
    blocoId;
    espessura;
    altura;
    largura;
    acabamento;
    status;
}
exports.CreatChapas = CreatChapas;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatChapas.prototype, "codigo", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatChapas.prototype, "blocoId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatChapas.prototype, "espessura", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatChapas.prototype, "altura", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatChapas.prototype, "largura", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatChapas.prototype, "acabamento", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(StatusChapas),
    __metadata("design:type", String)
], CreatChapas.prototype, "status", void 0);
//# sourceMappingURL=criar-chapas.dto.js.map