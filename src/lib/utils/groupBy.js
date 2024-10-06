/**
 * Function to group items in array of objects by certain key present in objects of the array
 * @param {Array} data - Array of objects
 * @param {string} groupByKey - Key name in string for which grouping needs to be applied
 * @returns {Object}
 */
export default function groupBy(data, groupByKey) {
	return data.reduce((acc, current) => {
		const groupByKeyValue = current[groupByKey]; // Extract value which will be key for the group

		if (!acc[groupByKeyValue]) {
			acc[groupByKeyValue] = []; // Initialize an empty array if this value doesn't exist
		}

		let obj = Object.fromEntries(Object.entries(current).filter(([key]) => key !== groupByKey)); // Exclude the key & value by which grouping is done

		acc[groupByKeyValue].push(obj);

		return acc;
	}, {});
}
