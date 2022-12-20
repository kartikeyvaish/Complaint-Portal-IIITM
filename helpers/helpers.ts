/** 
 * * function to check if a email is valid student email or not (for IIITM Gwalior)
 * - It should start with bcs, imt, img, cn
 * - It should end with @iiitm.ac.in
 */
export function isValidStudentEmail(email: string) {
    // if email is empty return false
    if (!email)
        return false;

    // Domain check
    if (email.endsWith("@iiitm.ac.in") === false)
        return false;

    // Batch check
    let eligibleBatches = ["bcs", "imt", "img", "cn"]
    let isEligible = false;

    for (let i = 0; i < eligibleBatches.length; i++) {
        if (email.startsWith(eligibleBatches[i])) {
            isEligible = true;
            break;
        }
    }

    if (!isEligible)
        return false;

    return true;
}

// Function to add leading zeros to a number
export function addLeadingZeros(num: number, totalLength: number) {
    return String(num).padStart(totalLength, '0');
}