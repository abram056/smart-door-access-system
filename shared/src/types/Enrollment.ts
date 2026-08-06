export interface EnrollmentRequest {

    deviceToken: string;

    uid: string;
}

export interface EnrollmentResponse {

    success: boolean;

    message: string;
}