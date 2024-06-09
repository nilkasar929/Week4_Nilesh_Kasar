import { Model, DataTypes } from 'sequelize';
import sequelize from '../postgres/pgConfig';

class SOWPaymentPlan extends Model {
  public id!: string;
  public sowId!: string;
  public customerId!: string;
  public plannedInvoiceDate!: Date;
  public totalActualAmount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SOWPaymentPlan.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    sowId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    plannedInvoiceDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    totalActualAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'sow_payment_plans',
  }
);

export default SOWPaymentPlan;
