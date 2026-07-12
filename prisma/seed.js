"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var usd, pkr, superAdminRole, financeRole, adminEmail, existingAdmin, passwordHash, admin;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Start seeding...');
                    return [4 /*yield*/, prisma.currency.upsert({
                            where: { code: 'USD' },
                            update: {},
                            create: {
                                code: 'USD',
                                name: 'US Dollar',
                                symbol: '$',
                            },
                        })];
                case 1:
                    usd = _a.sent();
                    return [4 /*yield*/, prisma.currency.upsert({
                            where: { code: 'PKR' },
                            update: {},
                            create: {
                                code: 'PKR',
                                name: 'Pakistani Rupee',
                                symbol: 'Rs',
                            },
                        })];
                case 2:
                    pkr = _a.sent();
                    console.log("Created currencies: ".concat(usd.code, ", ").concat(pkr.code));
                    return [4 /*yield*/, prisma.role.upsert({
                            where: { name: 'SUPER_ADMIN' },
                            update: {},
                            create: {
                                name: 'SUPER_ADMIN',
                                description: 'System Administrator with full access to all features',
                            },
                        })];
                case 3:
                    superAdminRole = _a.sent();
                    return [4 /*yield*/, prisma.role.upsert({
                            where: { name: 'FINANCE_MANAGER' },
                            update: {},
                            create: {
                                name: 'FINANCE_MANAGER',
                                description: 'Can manage deposits, withdrawals, and finance settings',
                            },
                        })];
                case 4:
                    financeRole = _a.sent();
                    console.log("Created roles: ".concat(superAdminRole.name, ", ").concat(financeRole.name));
                    adminEmail = 'admin@inveracapital.com';
                    return [4 /*yield*/, prisma.user.findUnique({ where: { email: adminEmail } })];
                case 5:
                    existingAdmin = _a.sent();
                    if (!!existingAdmin) return [3 /*break*/, 8];
                    return [4 /*yield*/, bcryptjs_1.default.hash('HammadBhai.786', 10)];
                case 6:
                    passwordHash = _a.sent();
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: adminEmail,
                                passwordHash: passwordHash,
                                roleId: superAdminRole.id,
                                status: 'ACTIVE',
                                profile: {
                                    create: {
                                        firstName: 'System',
                                        lastName: 'Administrator',
                                        country: 'PK'
                                    }
                                },
                                wallet: {
                                    create: {
                                        balance: 0
                                    }
                                }
                            }
                        })];
                case 7:
                    admin = _a.sent();
                    console.log("Created Super Admin user: ".concat(admin.email));
                    return [3 /*break*/, 9];
                case 8:
                    console.log("Super Admin ".concat(adminEmail, " already exists."));
                    _a.label = 9;
                case 9:
                    console.log('Seeding finished.');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
