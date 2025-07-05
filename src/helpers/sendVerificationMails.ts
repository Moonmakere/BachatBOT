import {resend} from '../lib/resend'
import  VerificationEmail from '../../emails/VerificationEmail'
import { ApiResponse } from '../types/ApiRespopnse'

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from:'onboarding@resend.dev',
            to: email,
            subject: 'EZTax | Verification Code',
            react: VerificationEmail({
                otp: verifyCode,
                username
            })
        });
        return{
            success: true,
            message: 'Verification email send successfully'
        }
    } catch (emailError) {
        console.error("Error sending verification email", emailError)
        return{success:false, message: 'Failed to send verification email'}
    }
}