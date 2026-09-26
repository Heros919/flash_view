import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
declare const JwtAuthGuard_base: import("@nestjs/passport", { with: { "resolution-mode": "import" } }).Type<import("@nestjs/passport", { with: { "resolution-mode": "import" } }).IAuthGuard>;
export declare class JwtAuthGuard extends JwtAuthGuard_base {
    private readonly reflector;
    constructor(reflector: Reflector);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean>;
}
export {};
