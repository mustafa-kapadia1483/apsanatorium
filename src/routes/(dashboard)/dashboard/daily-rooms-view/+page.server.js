import { strftime } from '$lib/utils/date-utils.js';
import { error, redirect } from '@sveltejs/kit';

// Function to format date to 'DD-MMM-YYYY'

export async function load({ params, url }) {
  const dailyRoomsViewDate = url.searchParams.get('dailyRoomsViewDate') || strftime('%F');
  const dailyRoomsViewData = await fetch(`${url.origin}/api/daily-rooms-view?date=${dailyRoomsViewDate}`).then(res => res.json());

  return {
    dailyRoomsViewDate,
    dailyRoomsViewData
  };
}

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const dailyRoomsViewDate = data.get('dailyRoomsViewDate');

    redirect(302, `/dashboard/daily-rooms-view?dailyRoomsViewDate=${dailyRoomsViewDate}`);
  }
};
