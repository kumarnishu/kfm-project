function generateServiceCode(number:number) {
    // Get current date
    const now = new Date();
    
    // Format date as YYYYMMDD
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');
    
    // Format number to be at least 4 digits, padded with zeros
    const formattedNumber = String(number).padStart(4, '0');
    
    // Combine date and formatted number
    const serviceCode = `${year}${month}${day}-${formattedNumber}`;
    
    return serviceCode;
}