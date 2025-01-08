export const roomViewIcons = {
  'booked': {
    key: "bZNq9wryfmWJk3oIRscCHOuVMjeaLI7owhEXyTbx9GUc52AZ",
    url: "https://utfs.io/f/bZNq9wryfmWJk3oIRscCHOuVMjeaLI7owhEXyTbx9GUc52AZ",
    size: "907",
    uploadedAt: "2024-11-11T20:43:21.000Z",
    color: "bg-[#f8e32e]"
  },
  'extra': {
    key: "bZNq9wryfmWJwICIkoWCYt8AoQcJvzjKIW1m923UDVNykLgB",
    url: "https://utfs.io/f/bZNq9wryfmWJwICIkoWCYt8AoQcJvzjKIW1m923UDVNykLgB",
    size: "1915",
    uploadedAt: "2024-11-11T20:43:21.000Z",
    color: "bg-[#8bfa6d]"
  },
  'empty': {
    key: "bZNq9wryfmWJlsq2EyiZ94sCb2XV5P7jRaHUYnK1DgJzrdhN",
    url: "https://utfs.io/f/bZNq9wryfmWJlsq2EyiZ94sCb2XV5P7jRaHUYnK1DgJzrdhN",
    size: "908",
    uploadedAt: "2024-11-11T20:43:21.000Z",
    color: "bg-white"
  },
  'blocked': {
    key: "bZNq9wryfmWJbGj4l0yfmWJXhUHs3t56vZoSb4FAPVDeKYay",
    url: "https://utfs.io/f/bZNq9wryfmWJbGj4l0yfmWJXhUHs3t56vZoSb4FAPVDeKYay",
    size: "1029",
    uploadedAt: "2024-11-11T20:43:21.000Z",
    color: "bg-[#f8c2c2]"
  },
  'occupied': {
    key: "bZNq9wryfmWJbSHebZyfmWJXhUHs3t56vZoSb4FAPVDeKYay",
    url: "https://utfs.io/f/bZNq9wryfmWJbSHebZyfmWJXhUHs3t56vZoSb4FAPVDeKYay",
    size: "703",
    uploadedAt: "2024-11-11T20:43:21.000Z",
    color: "bg-[#c5f97c]"
  }
}

/**
 * 
 * @param {string} status 
 * @returns {'occupied' | 'booked' | 'extra' | 'blocked' | 'empty'} Standard room status
 */
export function getStandardRoomStatus(status) {
  switch (status) {
    case 'CheckedIn':
    case 'CheckedOut':
      return 'occupied';
    case 'Booked':
      return 'booked';
    case 'Extra':
      return 'extra';
    case 'Blocked':
      return 'blocked';
    default:
      return 'empty';
  }
}