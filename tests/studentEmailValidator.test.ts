// Packages imports
import { describe, expect, test } from '@jest/globals';

// Local imports
import { isValidStudentEmail } from '../helpers/helpers';

// Run multiple tests
const testingEmails = {
    // Valid emails
    "bcs_2019078@iiitm.ac.in": true,
    "img_2019078@iiitm.ac.in": true,
    "imt_2019078@iiitm.ac.in": true,

    // Invalid emails
    "qcs_2019078@iiitm.ac.in": false,
    "rajusingh@gmail.com": false,
    "rajusing@iiitm.ac.in": false,
    "testet@gmail.com": false,
    "img_2019078@gmail.com": false,
    "bcs_2019078@gmail.com": false,
}

// Run all the tests
describe('Check if Valid Student Email', () => {
    // Loop through all the emails and check if they are valid or not
    for (const email in testingEmails) {
        test(email, () => {
            expect(isValidStudentEmail(email)).toBe(testingEmails[email]);
        });
    }
});