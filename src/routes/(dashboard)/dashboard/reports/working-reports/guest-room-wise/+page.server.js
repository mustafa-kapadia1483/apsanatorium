import { strftime } from '$lib/utils/date-utils';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ url }) => {
  const params = {
    startDate: url.searchParams.get('startDate') || strftime('%F'),
    endDate: url.searchParams.get('endDate') || strftime('%F'),
    guestName: url.searchParams.get('guestName') || '',
    ejammatId: url.searchParams.get('ejammatId') || '',
    roomId: url.searchParams.get('roomId') || '',
  };

  if (!url.searchParams.has('startDate') || !url.searchParams.has('endDate')) {
    return { params };
  }

  try {
    const guestRoomWise = await fetch(`${url.origin}/api/reports/working-reports/guest-room-wise?${new URLSearchParams(params)}`).then(res => res.json());

    for (let record of guestRoomWise) {
      record["Guest Name"] = record["Guest Name"].map((guestName, i) => `${i + 1}. ${guestName}`).join("<br/>")
    }

    const totals = guestRoomWise.reduce((prev, curr) => ({
      Expense: prev.Expense + curr.Expense,
      ['Room Rent']: prev["Room Rent"] + curr["Room Rent"],
    }), { Expense: 0, ["Room Rent"]: 0 })

    guestRoomWise.push({

      "Room Rate": "Total",
      "Expense": totals.Expense,
      "Room Rent": totals["Room Rent"]
    })

    return {
      guestRoomWise,
      params
    };
  } catch (error) {
    console.error('Error loading data:', error);
    return {
      error: 'Failed to load guest data',
    };
  }
};
