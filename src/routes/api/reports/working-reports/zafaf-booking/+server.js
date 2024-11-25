import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';
import { validateRequiredParams } from '$lib/server/validation-utils';
import { formatDateOrEmpty } from '$lib/server/sql-utls.js';

async function getZafafBooking(params) {
  function transformRecord(record) {
    return {
      BookingFromDate: record.BookingFromDate,
      BookingToDate: record.BookingToDate,
      OtherNoOfRoom: record.OtherNoOfRoom,
      CreatedDate: record.CreatedDate,
      groom: {
        name: record.GroomName,
        ejamaatId: record.GroomEjamaatID,
        addressContact: record.GroomAddressContact,
        mobileNo: record.GroomMobileNo,
        amilSahebName: record.GroomAmilSahebName,
        jamaatOffice: record.GroomJamaatOffice,
        mohalla: record.GroomMohalla,
        countryOfResidence: record.GroomCountryofResidence,
        whatsapp: record.GroomWhatsapp,
        email: record.GroomEmail
      },
      bride: {
        name: record.BrideName,
        ejamaatId: record.BrideEjamaatID,
        addressContact: record.BrideAddressContact,
        mobileNo: record.BrideMobileNo,
        amilSahebName: record.BrideAmilSahebName,
        jamaatOffice: record.BrideJamaatOffice,
        mohalla: record.BrideMohalla,
        countryOfResidence: record.BrideCountryofResidence,
        whatsapp: record.BrideWhatsapp,
        email: record.BrideEmail
      },
      relative: {
        name: record.RelativeName,
        ejamaatId: record.RelativeEjamaatID,
        addressContact: record.RelativeAddressContact,
        mobileNo: record.RelativeMobileNo,
        relation: record.RelativeRelation,
        whatsapp: record.RelativeWhatsapp,
        email: record.RelativeEmail
      }
    };
  }
  const query = `
      SELECT 
          GroomName,
          GroomEjamaatID,
          GroomAddressContact,
          GroomMobileNo,
          
          GroomAmilSahebName,
          GroomJamaatOffice,
          GroomMohalla,
          GroomCountryofResidence,
          
          BrideName,
          BrideEjamaatID,
          BrideAddressContact,
          BrideMobileNo,
          
          BrideAmilSahebName,
          BrideJamaatOffice,
          BrideMohalla,
          BrideCountryofResidence,
          
          RelativeName,
          RelativeEjamaatID,
          RelativeAddressContact,
          RelativeMobileNo,
          
          RelativeRelation,
          BookingFromDate,
          BookingToDate,
          OtherNoOfRoom,
          ${formatDateOrEmpty("CreatedDate")} AS CreatedDate,
          
          GroomWhatsapp,
          GroomEmail,
          BrideWhatsapp,
          BrideEmail,
          RelativeWhatsapp,
          RelativeEmail
      FROM BookingZafaf
      WHERE CAST(${params.sortBy} AS DATE) 
          BETWEEN CAST(@startDate AS DATE) AND CAST(@endDate AS DATE)
      ORDER BY CAST(${params.sortBy} AS DATETIME) DESC`;

  const queryParams = {
    startDate: { type: 'Date', value: params.startDate },
    endDate: { type: 'Date', value: params.endDate },
  };

  const results = await executeQuery(query, queryParams);
  
  return results.map(transformRecord);
}

export const GET = async ({ url }) => {
  try {
    const requiredParams = ['startDate', 'endDate', 'sortBy'];
    
    const validation = validateRequiredParams(url.searchParams, requiredParams);
    if ('error' in validation) {
      return json(validation, { status: 400 });
    }

    const result = await getZafafBooking(validation.params);

    return json(result);

  } catch (error) {
    console.error('Database error:', error);
    return json({
      error: 'Internal Server Error',
      message: error.message,
    }, { status: 500 });
  }
}