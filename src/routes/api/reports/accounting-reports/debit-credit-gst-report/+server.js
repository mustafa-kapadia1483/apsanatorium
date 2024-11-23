import { executeStoredProcedure } from '$lib/server/database';
import { json } from '@sveltejs/kit';

async function getDebitCreditGstReport(reportType, fromDate, toDate) {
  function calculateTotals(records) {
    return records.reduce((totals, row) => {
      return {
        SubAmount: totals.SubAmount + (parseFloat(row.SubAmount) || 0),
        TaxAmount: totals.TaxAmount + (parseFloat(row.TaxAmount) || 0),
        TotalAmount: totals.TotalAmount + (parseFloat(row.TotalAmount) || 0)
      };
    }, {
      SubAmount: 0,
      TaxAmount: 0,
      TotalAmount: 0
    });
  }

  try {
    const inputParams = {
      Types: { type: "VarChar", value: reportType },
      startDate: { type: "Date", value: fromDate },
      endDate: { type: "Date", value: toDate }
    };

    const result = await executeStoredProcedure('sp_Report_DebitCreditNote', inputParams);

    return {
      records: result.recordset,
      totals: calculateTotals(result.recordset)
    };
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
}

export const GET = async ({ url }) => {
  try {
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const reportType = url.searchParams.get('reportType');

    // Input validation
    if (!startDate) {
      return json({ error: 'Please provide startDate, endDate and reportType' }, { status: 400 });
    } else if (!endDate) {
      return json({ error: 'Please provide endDate' }, { status: 400 });
    } else if (!reportType) {
      return json({ error: 'Please provide reportType' }, { status: 400 });
    }

    const result = await getDebitCreditGstReport(reportType, startDate, endDate);

    return json(result);

  } catch (error) {
    console.error('Error fetching GST report:', error);
    return json({ error: 'Failed to fetch GST report', message: error.message }, { status: 500 });
  }
};