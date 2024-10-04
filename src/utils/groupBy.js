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
