import { strftime } from '$lib/utils/date-utils';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ url }) => {
  const params = {
    bookingType: url.searchParams.get('bookingType') || 'Booked',
    startDate: url.searchParams.get('startDate') || strftime('%F'),
    endDate: url.searchParams.get('endDate') || strftime('%F'),
    bookingSource: url.searchParams.get('bookingSource') || "Admin,Online",
    status: url.searchParams.get('status') || 'Provisional,Confirmed,Cancelled',
    advanceType: url.searchParams.get('advanceType') || 'All',
  };

  if (!url.searchParams.has('bookingType')) {
    return { params };
  }

  try {
    const generalBookingReportData = await fetch(`${url.origin}/api/reports/working-reports/general-booking-report?${new URLSearchParams(params)}`).then(res => res.json());

    return {
      generalBookingReportData,
      params
    };
  } catch (error) {
    console.error('Error loading data:', error);
    return {
      error: 'Failed to load guest data',
    };
  }
};
