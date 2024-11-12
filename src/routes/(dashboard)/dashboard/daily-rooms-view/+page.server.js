import { strftime } from '$lib/utils/date-utils.js';

// Function to format date to 'DD-MMM-YYYY'

export async function load({ params, url }) {
  const dailyRoomsViewDate = url.searchParams.get('dailyRoomsViewDate') || strftime('%F');
  const dailyRoomsViewData = await fetch(`${url.origin}/api/daily-rooms-view?date=${dailyRoomsViewDate}`).then(res => res.json());

  return {
    dailyRoomsViewDate,
    dailyRoomsViewData
  };
}