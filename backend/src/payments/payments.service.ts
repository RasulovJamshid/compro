import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsService {
  constructor(private configService: ConfigService) {}

  async handlePaymeWebhook(data: any) {
    // Implement Payme webhook logic
    console.log('Payme webhook:', data);
    return { success: true };
  }

  async handleClickWebhook(data: any) {
    // Implement Click webhook logic
    console.log('Click webhook:', data);
    return { success: true };
  }
}
