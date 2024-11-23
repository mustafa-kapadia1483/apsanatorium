import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';
import { formatDateOrEmpty } from '$lib/server/sql-utls';


async function getGuestRegister(params) {
  const query = `
    SELECT 
      ROW_NUMBER() OVER (ORDER BY StartDate, ETA) AS [Sr.No.],
      BookingID as [Booking ID],
      FullName as [Name],
      eJamaatID as [ITS No],
      PassportNumber as [Passport Number], 
      AadharNumber as [Aadhar Number],
      PanCard as [Pan Card],
      CountryofResidence as [Country of Residence],
      ContactNos as [Contact No],
      MobileNo as [Mobile No],
      RoomID as [Room ID],
      ${formatDateOrEmpty('StartDate')} + ' (' + ETA + ')' as [Start Date],
      ${formatDateOrEmpty('EndDate')} + ' (' + ExpectedCheckOut + ')' as [End Date],
      Gender,
      Age,
      DurationOfStay as [Duration of Stay],
      RoomCharge as [Room Charge]
    FROM vwPoliceReport 
    WHERE (
      (@startDate between startdate AND EndDate) OR 
      (@endDate between startdate AND EndDate)
    )
    ORDER BY StartDate, ETA
  `;
  const queryParams = {
    startDate: { value: params.startDate, type: "Date" },
    endDate: { value: params.endDate, type: "Date" }
  };

  return await executeQuery(query, queryParams);
}

export const GET = async ({ url }) => {
  // Get parameters from URL
  const params = {
    startDate: url.searchParams.get('startDate'),
    endDate: url.searchParams.get('endDate')
  };

  const missingParams = Object.entries(params).filter(([key, value]) => !value).map(([key]) => key);

  if (missingParams.length > 0) {
    return json({
      error: 'Bad Request',
      message: `Missing search parameters: ${missingParams.join(', ')}`
    }, { status: 400 });
  }

  try {

    const result = await getGuestRegister(params);

    return json(result);

  } catch (error) {
    return json({
      error: 'Internal Server Error',
      message: error.message,
    }, { status: 500 });
  }
}