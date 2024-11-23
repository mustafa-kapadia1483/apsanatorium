import { json } from '@sveltejs/kit';
import { executeQuery } from '$lib/server/database';


async function getGuestRegister() {
  const query = `
  SELECT 
    ROW_NUMBER() OVER (ORDER BY  FloorID, r.RoomID) AS [Sr.No.],
    r.RoomID AS [Room No.],
    rt.RTName AS [Room Type],
    rt.Rent, 
    rt.Extra2Guest AS [Guests 3 & 4],
    rt.Extra4Guest AS [Guests 5 & 6],
    rt.Extra6Guest AS [Guests 7 & 8],
    rt.HalfdayCharge AS [Half Day Charge]
  FROM 
    Rooms r 
  LEFT OUTER JOIN 
    dbo.fn_RoomType(GETDATE()) rt ON rt.RTID = r.RTID 
  WHERE 
    r.IsActive='Y'
  ORDER BY 
    FloorID, r.RoomID ASC;
  `;

  return await executeQuery(query);
}

export const GET = async () => {
  try {
    const result = await getGuestRegister();
    return json(result);

  } catch (error) {
    return json({
      error: 'Internal Server Error',
      message: error.message,
    }, { status: 500 });
  }
}