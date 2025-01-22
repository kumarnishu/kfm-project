export function generateServiceCode(kfm:string, serviceType = "default", date = new Date()) {
    if (!kfm || typeof kfm !== "string") {
        throw new Error("KFM keyword must be a non-empty string.");
    }

    // Format the date as YYYYMMDD
    const formattedDate = date
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "");

    // Generate a random 4-digit number for uniqueness
    const randomDigits = Math.floor(1000 + Math.random() * 9000);

    // Combine components to form the service code
    const serviceCode = `${kfm.toUpperCase()}-${serviceType.toUpperCase()}-${formattedDate}-${randomDigits}`;

    return serviceCode;
}