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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvoiceById = exports.getInvoices = exports.createInvoiceLineItem = exports.generateInvoices = void 0;
// src/services/invoiceService.ts
const invoiceModel_1 = __importDefault(require("../models/invoiceModel"));
const invoiceLineItem_1 = __importDefault(require("../models/invoiceLineItem"));
const sowPaymentPlan_1 = __importDefault(require("../models/sowPaymentPlan"));
const sowPaymentPlanLineitem_1 = __importDefault(require("../models/sowPaymentPlanLineitem"));
const generateInvoices = () => __awaiter(void 0, void 0, void 0, function* () {
    //const today = new Date();
    const today = '2024-04-01';
    console.log(today);
    const paymentPlans = yield sowPaymentPlan_1.default.findAll({
        where: {
            plannedInvoiceDate: today,
        },
    });
    const invoices = [];
    for (const plan of paymentPlans) {
        const lineItems = yield sowPaymentPlanLineitem_1.default.findAll({
            where: {
                sowPaymentPlanId: plan.id,
            },
        });
        const invoice = yield invoiceModel_1.default.create({
            sowId: plan.sowId,
            totalInvoiceValue: plan.totalActualAmount,
            status: 'Drafted',
            invoiceSentOn: today,
            customerId: plan.customerId,
            invoiceVersionNumber: 1, // initial version
            invoiceAmount: plan.totalActualAmount,
            invoiceTaxAmount: plan.totalActualAmount * 0.18, // assuming 18% tax rate
        });
        for (const item of lineItems) {
            yield invoiceLineItem_1.default.create({
                invoiceId: invoice.id,
                orderNo: item.orderId,
                particular: item.particular,
                rate: item.rate,
                unit: item.unit,
                total: item.total,
            });
        }
        invoices.push(invoice);
    }
    return invoices;
});
exports.generateInvoices = generateInvoices;
const createInvoiceLineItem = (lineItemData) => __awaiter(void 0, void 0, void 0, function* () {
    const lineItem = yield invoiceLineItem_1.default.create(lineItemData);
    return lineItem;
});
exports.createInvoiceLineItem = createInvoiceLineItem;
const getInvoices = () => __awaiter(void 0, void 0, void 0, function* () {
    const invoices = yield invoiceModel_1.default.findAll();
    return invoices;
});
exports.getInvoices = getInvoices;
const getInvoiceById = (invoiceId) => __awaiter(void 0, void 0, void 0, function* () {
    const invoice = yield invoiceModel_1.default.findByPk(invoiceId);
    return invoice;
});
exports.getInvoiceById = getInvoiceById;
//# sourceMappingURL=invoiceService.js.map