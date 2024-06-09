// src/services/invoiceService.ts
import Invoice from '../models/invoiceModel';
import InvoiceLineItem from '../models/invoiceLineItem';
import SOWPaymentPlan from '../models/sowPaymentPlan';
import SOWPaymentPlanLineItem from '../models/sowPaymentPlanLineitem';

export const generateInvoices = async () => {
  const today = new Date();
  const paymentPlans = await SOWPaymentPlan.findAll({
    where: {
      plannedInvoiceDate: today,
    },
  });

  const invoices = [];
  for (const plan of paymentPlans) {
    const lineItems = await SOWPaymentPlanLineItem.findAll({
      where: {
        sowPaymentPlanId: plan.id,
      },
    });

    const invoice = await Invoice.create({
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
      await InvoiceLineItem.create({
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
};

export const getInvoices = async () => {
  const invoices = await Invoice.findAll();
  return invoices;
};

export const getInvoiceById = async (invoiceId: string) => {
  const invoice = await Invoice.findByPk(invoiceId);
  return invoice;
};
