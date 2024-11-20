/** @type {import('./$types').PageServerLoad} */
export const load = async ({ url }) => {
  const params = {
    ejaamatId: url.searchParams.get('ejaamatId') || '',
    name: url.searchParams.get('name') || '',
    email: url.searchParams.get('email') || '',
    contact: url.searchParams.get('contact') || '',
    guestType: url.searchParams.get('guestType') || 'current',
    page: url.searchParams.get('page') || 1
  };

  if (!url.searchParams.has('guestType')) {
    return { params };
  }

  try {

    const response = await fetch(
      `${url.origin}/api/reports/admin-reports/generate-email-phone?${new URLSearchParams(params)}`
    );
    const emailPhoneData = await response.json();

    return {
      emailPhoneData: emailPhoneData.data,
      params,
      pagination: emailPhoneData.pagination
    };

  } catch (error) {
    console.error('Error loading data:', error);
    return {
      error: 'Failed to load guest data',
      guests: []
    };
  }
};
