import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SmsService {
  private apiKey: string;
  private apiUrl: string;
  private devMode: boolean;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('SMS_API_KEY');
    this.apiUrl = this.configService.get('SMS_API_URL') || 'https://notify.eskiz.uz/api';
    this.devMode = this.configService.get('DEV_MODE') === 'true';
  }

  async sendSms(phone: string, message: string): Promise<void> {
    // In dev mode, just log the SMS instead of sending
    if (this.devMode) {
      console.log('📱 [DEV MODE] SMS would be sent:');
      console.log(`   To: ${phone}`);
      console.log(`   Message: ${message}`);
      console.log('   (SMS sending disabled in dev mode)');
      return;
    }

    try {
      // Example for Eskiz.uz SMS provider
      // Adjust according to your SMS provider's API
      await axios.post(
        `${this.apiUrl}/message/sms/send`,
        {
          mobile_phone: phone,
          message: message,
          from: '4546',
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );
      console.log(`✅ SMS sent successfully to ${phone}`);
    } catch (error) {
      console.error('❌ SMS sending error:', error.message);
      // In development, don't throw error
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    }
  }
}
