import { executeStoredProcedure } from '$lib/server/database';
import { json } from '@sveltejs/kit';

export const GET = async ({ url }) => {
  try {
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    // Input validation
    if (!startDate || !endDate) {
      return json({ error: 'Please provide both startDate and endDate' }, { status: 400 });
    }

    // Use executeStoredProcedure instead of direct pool access
    const inputParams = {
      startDate: { type: "Date", value: startDate },
      endDate: { type: "Date", value: endDate }
    };
    const result = await executeStoredProcedure('GSTRports', inputParams);

    // Calculate totals
    const totals = result.recordset.reduce((acc, curr) => ({
      totalRoomRent: acc.totalRoomRent + parseFloat(curr['Total Room Rent'] || 0),
      discount: acc.discount + parseFloat(curr['Discount'] || 0),
      taxableRoomRent: acc.taxableRoomRent + parseFloat(curr['Taxable Room Rent'] || 0),
      cgst: acc.cgst + parseFloat(curr['CGST'] || 0),
      sgst: acc.sgst + parseFloat(curr['SGST'] || 0),
      netRoomRent: acc.netRoomRent + parseFloat(curr['Net Room Rent'] || 0),
      additionalCharge: acc.additionalCharge + parseFloat(curr['Additional Charge'] || 0)
    }), {
      totalRoomRent: 0,
      discount: 0,
      taxableRoomRent: 0,
      cgst: 0,
      sgst: 0,
      netRoomRent: 0,
      additionalCharge: 0
    });

    return json({
      records: result.recordset,
      totals,
      recordCount: result.recordset.length
    });

  } catch (error) {
    console.error('Error fetching GST report:', error);
    return json({ error: 'Failed to fetch GST report' }, { status: 500 });
  }
};