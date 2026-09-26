"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Papeis = exports.PAPEIS_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.PAPEIS_KEY = 'papeis';
const Papeis = (...papeis) => (0, common_1.SetMetadata)(exports.PAPEIS_KEY, papeis);
exports.Papeis = Papeis;
//# sourceMappingURL=roles.decorator.js.map