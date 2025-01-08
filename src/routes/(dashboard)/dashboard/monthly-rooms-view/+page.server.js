import { getMonthlyRoomsView } from '$lib/server/database';
import { strftime, adjustDateByDays } from '$lib/utils/date-utils';
import { error } from '@sveltejs/kit';
import { roomViewIcons, getStandardRoomStatus } from '$lib/utils/room-view-icons';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ url }) => {
    const startDate = url.searchParams.get('startDate') || strftime('%F', adjustDateByDays(new Date(), -2));
    const endDate = url.searchParams.get('endDate') || strftime('%F', adjustDateByDays(new Date(), 7));
    const monthlyRoomsViewRespone = await getMonthlyRoomsView(startDate, endDate);

    if(monthlyRoomsViewRespone.status === "failed") {
        throw error(500, "Failed to fetch monthly rooms view data");
    }

    const monthlyRoomsViewData = monthlyRoomsViewRespone.monthlyRoomsViewData.map((row) => {
        const { theDate, ...rest } = row
        const rommData = Object.entries(rest).map(([key, value]) => {
            const roomStatus = value.split(',').at(-2)
            const standardRoomStatus = getStandardRoomStatus(roomStatus);
    
            return {
                    roomId: key,
                    status: standardRoomStatus,
                    iconUrl: roomViewIcons[standardRoomStatus].url,
                    color: roomViewIcons[standardRoomStatus].color
                };
        })

        return {    
            date: theDate,
            // Sort the rooms based on roomId in reverse order
            data: rommData.sort(function (a, b) {
                if (a.roomId > b.roomId) {
                  return -1;
                }
                if (a.roomId < b.roomId) {
                  return 1;
                }
                return 0;
              }),
        }
    });

    return {
        monthlyRoomsViewData,
        startDate,
        endDate
    }
};