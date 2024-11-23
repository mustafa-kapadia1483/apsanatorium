import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';
import { strftime } from '$lib/utils/date-utils';

function mapCollectionReport({ Amount, CollectionDate, ...rest }) {
  let amountIn = 0;
  let amountOut = 0;
  if (Amount > 0) {
    amountIn = Amount;
  } else {
    amountOut = Amount;
  }

  CollectionDate = strftime('%d-%b-%Y', new Date(CollectionDate));
  return { amountIn, amountOut, CollectionDate, ...rest };
}

function calculateTotals(records) {
  const result = records.reduce((acc, curr) => {
    const amount = parseFloat(curr.Amount);
    if (amount >= 0) {
      acc.amountIn += amount;
    } else {
      acc.amountOut += Math.abs(amount);
    }
    return acc;
  }, { amountIn: 0, amountOut: 0 });

  result.totalCollection = result.amountIn - result.amountOut;
  return result;
}

function calculateForfeitTotal(records) {
  return records.reduce((total, curr) => total + parseFloat(curr.ForfeitedAmount), 0);
}

export async function GET({ url }) {
  const startDate = url.searchParams.get('startDate') ?? strftime('%F');
  const endDate = url.searchParams.get('endDate') ?? strftime('%F');
  const bookingId = url.searchParams.get('bookingId') ?? "";
  const showForfeit = url.searchParams.get('showForfeit') == "true";
  const paymentType = url.searchParams.get('paymentType');
  const reportType = url.searchParams.get('reportType');
  const forfeitCondition = url.searchParams.get('forfeitCondition') ?? "";

  try {
    const collectionQuery = `
      SELECT DISTINCT 
        T.BookingID, T.TableType as RecType, T.Remarks, T.ReceiptID, 
        T.Amount, T.TaxAmount, T.UserID,
        T.CtimeStamp as CollectionDate,
        ISNULL(VD.BookedName,'') as GuestName,
        T.Remarks, T.PayType 
      FROM (
        SELECT 
          'Advance' as TableType,
          CONVERT(varchar, OCID) as ReceiptID,
          BookingID, Amount, SubTotalTax as TaxAmount,
          Remarks, PaymentType AS PayType, UserID,
          OCDate as CtimeStamp
        FROM dbo.OtherCharges
        UNION
        SELECT 
          CASE WHEN Amount > 0 THEN 'Rent' ELSE 'Refund' END as TableType,
          ReceiptID, BookingID, Amount, 0 as TaxAmount,
          '' As Remarks, ReceiptType As PayType,
          UserID, RctDate as CtimeStamp
        FROM dbo.Receipt
      ) T 
      LEFT OUTER JOIN vwRoomDetails VD ON T.BookingID = VD.BookingID 
      WHERE ${bookingId ?
        `T.BookingID='${bookingId}'` :
        `CONVERT(datetime, CONVERT(varchar(10),T.CtimeStamp,112)) BETWEEN @startDate AND @endDate`
      }
      ${reportType !== 'All' ? `AND TableType='${reportType}'` : ''}
      ${paymentType !== 'All' ? `AND PayType='${paymentType}'` : ''}
      ORDER BY T.CtimeStamp ASC`;

    const params = {
      startDate: { type: "Date", value: startDate },
      endDate: { type: "Date", value: endDate }
    };

    const collectionResult = await executeQuery(collectionQuery, params);
    const response = {
      collectionReport: collectionResult.map(mapCollectionReport),
      totalCollection: calculateTotals(collectionResult)
    };

    // Forfeit Report if requested
    if (showForfeit) {
      const forfeitQuery = `
        SELECT 
          RC.BookingID, ISNULL(RB.RoomID,0) as RoomID,
          EM.FullName as GuestName, RC.ForfeitedDate, RC.ForfeitedAmount,
          RC.Remarks, B.eJamaatID, RC.UserID
        FROM RoomCancel RC
        LEFT OUTER JOIN RoomBooking RB ON RB.BookingID=RC.BookingID AND RB.RBID=RC.RBID
        LEFT OUTER JOIN Booking B ON B.BookingID=RC.BookingID
        LEFT OUTER JOIN EJamaatMaster EM ON EM.eJamaatID=B.eJamaatID
        WHERE 1=1
        ${bookingId ?
          `AND RC.BookingID='${bookingId}'` :
          `AND CONVERT(datetime,CONVERT(varchar(10),DATEADD(day, 0,RC.ForfeitedDate),112)) 
           BETWEEN @startDate AND @endDate`}
        ${forfeitCondition ? `AND RC.ForfeitedAmount${forfeitCondition}` : ''}
        ORDER BY ForfeitedDate ASC`;

      const forfeitResult = await executeQuery(forfeitQuery, params);
      response.forfeitReport = forfeitResult.map(({ ForfeitedDate, ...rest }) => ({
        ForfeitedDate: strftime('%d-%b-%Y', new Date(ForfeitedDate)),
        ...rest
      }));
      response.totalForfeit = calculateForfeitTotal(forfeitResult);
    }

    return json(response);
  } catch (err) {
    console.log(err);
    return json({
      error: err
    });
  }
}
