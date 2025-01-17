import { strftime } from '$lib/utils/date-utils';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ url }) => {
  const params = {
    startDate: url.searchParams.get('startDate') || strftime('%F'),
    endDate: url.searchParams.get('endDate') || strftime('%F')
  };

  if (!url.searchParams.has('startDate') || !url.searchParams.has('endDate')) {
    return { params };
  }

  try {
    const guestRegisterData = await fetch(`${url.origin}/api/reports/working-reports/guest-register?${new URLSearchParams(params)}`).then(res => res.json());

    return {
      guestRegisterData,
      params
    };
  } catch (error) {
    console.error('Error loading data:', error);
    return {
      error: 'Failed to load guest data',
    };
  }
};
