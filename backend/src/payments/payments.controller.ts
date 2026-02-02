import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('payme/webhook')
  @ApiOperation({ summary: 'Payme webhook' })
  handlePaymeWebhook(@Body() data: any) {
    return this.paymentsService.handlePaymeWebhook(data);
  }

  @Post('click/webhook')
  @ApiOperation({ summary: 'Click webhook' })
  handleClickWebhook(@Body() data: any) {
    return this.paymentsService.handleClickWebhook(data);
  }
}
