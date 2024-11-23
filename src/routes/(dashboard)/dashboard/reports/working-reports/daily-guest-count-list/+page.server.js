import { strftime, adjustDateByDays } from '$lib/utils/date-utils';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ url }) => {
  const params = {
    startDate: url.searchParams.get('startDate') || strftime('%F'),
    endDate: url.searchParams.get('endDate') || strftime('%F', adjustDateByDays(new Date(), 10))
  };

  try {
    const dailyGuestCountListData = await fetch(`${url.origin}/api/reports/working-reports/daily-guest-count-list?${new URLSearchParams(params)}`).then(res => res.json());

    const totals = dailyGuestCountListData.reduce((sum, row) => ({
      "Guest Count": sum["Guest Count"] + row["Guest Count"],
      "Check In Room Count": sum["Check In Room Count"] + row["Check In Room Count"]
    }), {
      "Guest Count": 0,
      "Check In Room Count": 0
    });


    dailyGuestCountListData.push({
      "#": "",
      "Booking Date": "Total",
      "Guest Count": totals["Guest Count"],
      "Check In Room Count": totals["Check In Room Count"]
    });

    return {
      dailyGuestCountListData,
      params
    };
  } catch (error) {
    console.error('Error loading data:', error);
    return {
      error: 'Failed to load daily guest count list data',
    };
  }
};
