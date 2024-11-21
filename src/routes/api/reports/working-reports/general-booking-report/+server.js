import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';
import { formatDateOrEmpty } from '$lib/server/sql-utls';
import sql from 'mssql';

async function getGeneralBookingReport(params) {
  function buildConditionList(paramString, paramPrefix, queryParams, sqlType) {
    return paramString.split(',').map((param, index) => {
      const paramName = `${paramPrefix}${index}`;
      queryParams[paramName] = { type: sqlType, value: param };
      return paramName;
    });
  }

  let cond1 = '';
  let cond2 = '';
  let condDate = '';
  let joiner = '';

  const queryParams = {};

  // Handle booking source condition
  if (params.bookingSource === 'Wedding') {
    cond2 += ' T.WeddingGst > 0 AND ';
  } else {
    const bookingSourceList = buildConditionList(params.bookingSource, 'bookingSource', queryParams, sql.VarChar);
    cond1 = `B.Bookedby IN (${bookingSourceList.map(s => `@${s}`).join(',')})`;
    joiner = ' AND ';
  }

  // Handle status condition
  const status = params.status;
  if (status === 'CancelbyAPS') {
    cond1 += `${joiner} B.BookingStatus IN ('Cancelled') AND B.CancelledBy NOT IN ('AutoExpiry') AND B.ConfirmedTimeStamp IS NULL`;
  } else if (status === 'ExpiryOnline') {
    cond1 += `${joiner} B.BookingStatus IN ('Cancelled') AND B.CancelledBy IN ('AutoExpiry')`;
  } else {
    const statusList = buildConditionList(status, 'status', queryParams, sql.VarChar);
    cond1 += `${joiner} B.BookingStatus IN (${statusList.map(s => `@${s}`).join(',')})`;
  }

  // Reset joiner for advance conditions
  joiner = '';

  // Handle advance payment condition
  if (params.advanceType !== 'All') {
    if (params.advanceType === 'ZeroDeposit') {
      cond2 += `${joiner} T.TotAdvAmount = 0`;
    } else {
      cond2 += `${joiner} T.TotAdvAmount > 0`;
    }
    joiner = ' AND ';
  }

  // Set date field based on booking type
  condDate = params.bookingType === 'Booked' ? 'T.TimeStamp' : 'T.SDate';

  // Add date range condition
  cond2 += `${joiner} CONVERT(DATETIME, CONVERT(VARCHAR(10), DATEADD(day, 0, ${condDate}), 112)) 
              BETWEEN CONVERT(DATETIME, @startDate) AND CONVERT(DATETIME, @endDate)`;
  queryParams.startDate = { type: sql.DateTime, value: new Date(params.startDate) };
  queryParams.endDate = { type: sql.DateTime, value: new Date(params.endDate) };

  // Construct the main query
  // Use * to check if additional columns are needed
  const query = `
        SELECT 
            ROW_NUMBER() OVER (ORDER BY ${condDate} ASC) AS #,
            Bookedby AS [Booking Type],
            CASE
                WHEN WeddingGst > 0
                THEN BookingId + ' (Saifee Plan)'
                ELSE BookingId
            END AS BookingID,
            CASE 
                WHEN BookingStatus = 'Cancelled' AND CancelledBy = 'AutoExpiry' 
                  THEN 'Expiry Online'
                ELSE BookingStatus
            END AS Status,
            CASE 
                WHEN ejamaatID IS NOT NULL AND ISNUMERIC(ejamaatID) = 1
                THEN Name + ' (' + CAST(ejamaatID AS VARCHAR) + ')'
                ELSE Name 
            END AS Name,
            Rooms,
            cntguest AS [Total Guests],
            Advance,
            TaxAdv As Tax,
            TotAdvAmount As [Total Advance],
            ${formatDateOrEmpty('SDate')} As [Start Date],
            BookName As [Booked By],
            ${formatDateOrEmpty('TimeStamp')} As [Booked Date],
            ConfirmName As [Confirmed By],
            ${formatDateOrEmpty('ConfirmedTimeStamp')} As [Confirmed Date],
            Remark As [Confirmed Remark],
            CancellName As [Cancelled By],
            ${formatDateOrEmpty('BookingExpiryDate')} As [Cancelled Date]
        FROM (
            SELECT 
                B.*,
                ISNULL(EM.FullName, '') AS Name,
                EM.ContactNos,
                EM.MobileNo,
                EM.eMail,
                ISNULL((SELECT SUM(OC.Amount) FROM dbo.OtherCharges OC WHERE OC.ChargeType='Advance' AND OC.BookingID=B.BookingID), 0) AS TotAdvAmount,
                ISNULL((SELECT SUM(OC.SubTotalTax) FROM dbo.OtherCharges OC WHERE OC.ChargeType='Advance' AND OC.BookingID=B.BookingID), 0) AS TaxAdv,
                ISNULL((SELECT SUM(OC.SubTotal) FROM dbo.OtherCharges OC WHERE OC.ChargeType='Advance' AND OC.BookingID=B.BookingID), 0) AS Advance,
                ISNULL((SELECT COUNT(rb.RBID) FROM RoomBooking rb WHERE rb.Package != '' AND rb.BookingID=B.BookingID), 0) AS WeddingGst,
                ISNULL((SELECT COUNT(BG.BGID) FROM BookingGuest BG WHERE BG.BookingID=B.BookingID), 0) AS cntguest,
                ISNULL((SELECT COUNT(RBID) FROM dbo.RoomBooking WHERE ParentRoomID=0 AND BookingID=B.BookingID), 0) AS Rooms,
                ISNULL((SELECT MIN(Startdate) FROM dbo.RoomBooking WHERE BookingID=B.BookingID), 0) AS SDate,
                CASE BookedBy 
                    WHEN 'Online' THEN UserID 
                    ELSE ISNULL((SELECT u.Username FROM Users u WHERE u.UserID=B.UserID), '')
                END AS BookName,
                CASE BookedBy 
                    WHEN 'Admin' THEN '' 
                    ELSE ISNULL((SELECT u.Username FROM Users u WHERE u.UserID=B.ConfirmedBy), '')
                END AS ConfirmName,
                CASE CancelledBy 
                    WHEN 'AutoExpiry' THEN 'AutoExpiry' 
                    ELSE ISNULL((SELECT u.Username FROM Users u WHERE u.UserID=B.CancelledBy), '')
                END AS CancellName
            FROM Booking B
            LEFT OUTER JOIN EJamaatMaster EM ON B.ejamaatID=EM.ejamaatID
            WHERE ${cond1}
        ) T 
        WHERE ${cond2}
        ORDER BY ${condDate} ASC`;

  return await executeQuery(query, queryParams);
}

export const GET = async ({ url }) => {
  // Get parameters from URL
  const params = {
    bookingType: url.searchParams.get('bookingType'),
    startDate: url.searchParams.get('startDate'),
    endDate: url.searchParams.get('endDate'),
    bookingSource: url.searchParams.get('bookingSource'),
    status: url.searchParams.get('status'),
    advanceType: url.searchParams.get('advanceType')
  };

  const missingParams = Object.entries(params).filter(([key, value]) => !value).map(([key]) => key);

  if (missingParams.length > 0) {
    return json({
      error: 'Bad Request',
      message: `Missing search parameters: ${missingParams.join(', ')}`
    }, { status: 400 });
  }
  try {

    const result = await getGeneralBookingReport(params);

    return json(result);

  } catch (error) {
    return json({
      error: 'Internal Server Error',
      message: error.message,
    }, { status: 500 });
  }
}