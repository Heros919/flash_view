import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { UsuarioAutenticado, UsuarioService } from '../../usuario/usuario.service';
export type JwtPayload = {
    sub: number;
    email: string;
    papel: string;
};
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly usuarioService;
    constructor(config: ConfigService, usuarioService: UsuarioService);
    validate(payload: JwtPayload): UsuarioAutenticado;
}
export {};
