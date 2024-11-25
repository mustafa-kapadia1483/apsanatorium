import { getOneMonthAgo, strftime } from '$lib/utils/date-utils';

const formatPersonDetails = (person, type = "relative") => { 
  let details = `
    <strong>${person.name} (${person.ejamaatId})</strong>
    <br/>
    Address:<address>${person.addressContact}</address>
    Mobile No: ${person.mobileNo}
    <br/>
    Whatsapp No: ${person.whatsapp}
    <br/>
    Email: ${person.email}
    <br/>
  `;

  if (type !== "short") {
    details += `
      Country of Residence: ${person.countryOfResidence}
      <hr/>
      Amil Saheb Name: ${person.amilSahebName}
      <br/>
      Jamaat Office: ${person.jamaatOffice}
      <br/>
      Mohalla: ${person.mohalla}
    `;
  }

  return details;
};

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ url }) => {
  const params = {
    startDate: url.searchParams.get('startDate') || strftime('%F',getOneMonthAgo()),
    endDate: url.searchParams.get('endDate') || strftime('%F'),
    sortBy: url.searchParams.get('sortBy') || 'CreatedDate',
  };

  try {
    const zafafBooking = await fetch(
      `${url.origin}/api/reports/working-reports/zafaf-booking?${new URLSearchParams(params)}`
    ).then(res => res.json());

    const zafafBookingData = zafafBooking.map((record, index) => {
      const {
        BookingFromDate,
        BookingToDate,
        OtherNoOfRoom,
        CreatedDate,
        groom,
        bride,
        relative
      } = record;

      return {
        "Sr": index + 1,
        "Groom Details": formatPersonDetails(groom),
        "Bride Details": formatPersonDetails(bride),
        "Booking From Date": BookingFromDate,
        "Booking To Date": BookingToDate,
        "Other No Of Room": OtherNoOfRoom,
        "Relative Details": formatPersonDetails(relative, "short"),
        "Created Date": CreatedDate
      };
    });

    return {
      zafafBookingData,
      params
    };
  } catch (error) {
    console.error('Error loading data:', error);
    return {
      error: 'Failed to load guest data'
    };
  }
};
