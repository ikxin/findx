const PI = Math.PI;
const SEMI_MAJOR_AXIS = 6378245;
const ECCENTRICITY_SQUARED = 0.006693421622965943;

function isOutsideChina(longitude: number, latitude: number) {
	return longitude < 72.004 || longitude > 137.8347 || latitude < 0.8293 || latitude > 55.8271;
}

function transformLatitude(longitude: number, latitude: number) {
	let result = -100 + 2 * longitude + 3 * latitude + 0.2 * latitude * latitude;
	result += 0.1 * longitude * latitude + 0.2 * Math.sqrt(Math.abs(longitude));
	result += ((20 * Math.sin(6 * longitude * PI) + 20 * Math.sin(2 * longitude * PI)) * 2) / 3;
	result += ((20 * Math.sin(latitude * PI) + 40 * Math.sin((latitude * PI) / 3)) * 2) / 3;
	result += ((160 * Math.sin((latitude * PI) / 12) + 320 * Math.sin((latitude * PI) / 30)) * 2) / 3;
	return result;
}

function transformLongitude(longitude: number, latitude: number) {
	let result = 300 + longitude + 2 * latitude + 0.1 * longitude * longitude;
	result += 0.1 * longitude * latitude + 0.1 * Math.sqrt(Math.abs(longitude));
	result += ((20 * Math.sin(6 * longitude * PI) + 20 * Math.sin(2 * longitude * PI)) * 2) / 3;
	result += ((20 * Math.sin(longitude * PI) + 40 * Math.sin((longitude * PI) / 3)) * 2) / 3;
	result += ((150 * Math.sin((longitude * PI) / 12) + 300 * Math.sin((longitude * PI) / 30)) * 2) / 3;
	return result;
}

export function gcj02ToWgs84(longitude: number, latitude: number): [number, number] {
	if (isOutsideChina(longitude, latitude)) {
		return [longitude, latitude];
	}

	let latitudeDelta = transformLatitude(longitude - 105, latitude - 35);
	let longitudeDelta = transformLongitude(longitude - 105, latitude - 35);
	const latitudeRadians = (latitude / 180) * PI;
	const latitudeSine = Math.sin(latitudeRadians);
	const magic = 1 - ECCENTRICITY_SQUARED * latitudeSine * latitudeSine;
	const squareRootMagic = Math.sqrt(magic);
	latitudeDelta = (latitudeDelta * 180) / (((SEMI_MAJOR_AXIS * (1 - ECCENTRICITY_SQUARED)) / (magic * squareRootMagic)) * PI);
	longitudeDelta = (longitudeDelta * 180) / ((SEMI_MAJOR_AXIS / squareRootMagic) * Math.cos(latitudeRadians) * PI);

	return [longitude * 2 - (longitude + longitudeDelta), latitude * 2 - (latitude + latitudeDelta)];
}
