/**
 * Port of strftime() by T. H. Doan (https://thdoan.github.io/strftime/)
 * @param {string} sFormat - Format in which date string needs to be returned in
 * @param {Date|null} date - Date object for which formatted string will be returned
 * @returns {string}
 */
export function strftime(sFormat, date = null) {
	if (typeof sFormat !== 'string') {
		return '';
	}

	if (!(date instanceof Date)) {
		date = new Date();
	}

	const nDay = date.getDay();
	const nDate = date.getDate();
	const nMonth = date.getMonth();
	const nYear = date.getFullYear();
	const nHour = date.getHours();
	const nTime = date.getTime();
	const aDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const aMonths = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const aDayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
	const isLeapYear = () => (nYear % 4 === 0 && nYear % 100 !== 0) || nYear % 400 === 0;
	const getThursday = () => {
		const target = new Date(date);
		target.setDate(nDate - ((nDay + 6) % 7) + 3);
		return target;
	};
	const zeroPad = (nNum, nPad) => (Math.pow(10, nPad) + nNum + '').slice(1);

	return sFormat.replace(/%[a-z]+\b/gi, (sMatch) => {
		return (
			({
				'%a': aDays[nDay].slice(0, 3),
				'%A': aDays[nDay],
				'%b': aMonths[nMonth].slice(0, 3),
				'%B': aMonths[nMonth],
				'%c': date.toUTCString().replace(',', ''),
				'%C': Math.floor(nYear / 100),
				'%d': zeroPad(nDate, 2),
				'%e': nDate,
				'%F': new Date(nTime - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10),
				'%G': getThursday().getFullYear(),
				'%g': (getThursday().getFullYear() + '').slice(2),
				'%H': zeroPad(nHour, 2),
				'%I': zeroPad(((nHour + 11) % 12) + 1, 2),
				'%j': zeroPad(aDayCount[nMonth] + nDate + (nMonth > 1 && isLeapYear() ? 1 : 0), 3),
				'%k': nHour,
				'%l': ((nHour + 11) % 12) + 1,
				'%m': zeroPad(nMonth + 1, 2),
				'%n': nMonth + 1,
				'%M': zeroPad(date.getMinutes(), 2),
				'%p': nHour < 12 ? 'AM' : 'PM',
				'%P': nHour < 12 ? 'am' : 'pm',
				'%s': Math.round(nTime / 1000),
				'%S': zeroPad(date.getSeconds(), 2),
				'%u': nDay || 7,
				'%V': (() => {
					const target = getThursday();
					const n1stThu = target.valueOf();
					target.setMonth(0, 1);
					const nJan1 = target.getDay();

					if (nJan1 !== 4) {
						target.setMonth(0, 1 + ((4 - nJan1 + 7) % 7));
					}

					return zeroPad(1 + Math.ceil((n1stThu - target) / 604800000), 2);
				})(),
				'%w': nDay,
				'%x': date.toLocaleDateString(),
				'%X': date.toLocaleTimeString(),
				'%y': (nYear + '').slice(2),
				'%Y': nYear,
				'%z': date.toTimeString().replace(/.+GMT([+-]\d+).+/, '$1'),
				'%Z': date.toTimeString().replace(/.+\((.+?)\)$/, '$1'),
				'%Zs': new Intl.DateTimeFormat('default', {
					timeZoneName: 'short'
				})
					.formatToParts(date)
					.find((oPart) => oPart.type === 'timeZoneName')?.value
			}[sMatch] || '') + '' || sMatch
		);
	});
}

/**
 * Checks whether a date is today or no
 * @param {Date|string} date - Date that needs to be checked whether it'today
 * @returns {Boolean}
 */
export function isToday(date) {
	const DATE_FORMAT = '%Y%m%d';
	return strftime(DATE_FORMAT) == strftime(DATE_FORMAT, new Date(date));
}

/**
 * Converts a 24-hour time string to 12-hour format with AM/PM
 * @param {string} time - Time string in 24-hour format (HH:mm)
 * @returns {string} Time string in 12-hour format with AM/PM, or empty string if input is invalid
 * @example
 * formatTimeWithAMPM('13:30') // Returns '1:30 PM'
 * formatTimeWithAMPM('09:05') // Returns '9:05 AM'
 * formatTimeWithAMPM('') // Returns ''
 */
export function formatTimeWithAMPM(time) {
	// Return early if time is null, undefined or empty string
	if (!time || time === '') return '';

	try {
		// Extract hours and minutes from the time string
		let [hours, minutes] = time.split(':').map(num => parseInt(num, 10));

		// Validate hours and minutes
		if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
			throw new Error('Invalid time format');
		}

		// Default to 12-hour format
		let period = hours >= 12 ? 'PM' : 'AM';

		// Convert 24-hour format to 12-hour format
		hours = hours % 12;
		hours = hours ? hours : 12; // Convert 0 to 12

		// Format the time string
		return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
	} catch (error) {
		console.error('Error formatting time:', error);
		return time; // Return original time if there's an error
	}
}