import { strftime } from '$lib/utils/date-utils';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ url }) => {
  try {
    const roomRateCardData = await fetch(`${url.origin}/api/reports/working-reports/room-rate-card`).then(res => res.json());

    return {
      roomRateCardData,
    };
  } catch (error) {
    console.error('Error loading data:', error);
    return {
      error: 'Failed to load guest data',
    };
  }
};
