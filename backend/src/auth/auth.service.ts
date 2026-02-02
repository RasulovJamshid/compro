import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from './sms.service';

interface VerificationCode {
  code: string;
  phone: string;
  expiresAt: Date;
}

@Injectable()
export class AuthService {
  private verificationCodes: Map<string, VerificationCode> = new Map();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private smsService: SmsService,
  ) {}

  async sendVerificationCode(phone: string): Promise<{ success: boolean; message: string }> {
    // Normalize phone number
    const normalizedPhone = this.normalizePhone(phone);

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store code with 5 minute expiration
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    this.verificationCodes.set(normalizedPhone, {
      code,
      phone: normalizedPhone,
      expiresAt,
    });

    // Send SMS
    try {
      await this.smsService.sendSms(normalizedPhone, `Ваш код подтверждения: ${code}`);
      return {
        success: true,
        message: 'Код отправлен на ваш номер телефона',
      };
    } catch (error) {
      // In development, log the code
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Verification code for ${normalizedPhone}: ${code}`);
      }
      return {
        success: true,
        message: 'Код отправлен (dev mode)',
      };
    }
  }

  async verifyCode(phone: string, code: string) {
    const normalizedPhone = this.normalizePhone(phone);
    const storedCode = this.verificationCodes.get(normalizedPhone);

    if (!storedCode) {
      throw new UnauthorizedException('Код не найден или истек');
    }

    if (storedCode.expiresAt < new Date()) {
      this.verificationCodes.delete(normalizedPhone);
      throw new UnauthorizedException('Код истек');
    }

    if (storedCode.code !== code) {
      throw new UnauthorizedException('Неверный код');
    }

    // Remove used code
    this.verificationCodes.delete(normalizedPhone);

    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { phone: normalizedPhone },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone: normalizedPhone,
          role: 'free',
        },
      });
    }

    // Generate JWT
    const payload = { sub: user.id, phone: user.phone, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, user };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscriptions: true },
    });

    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    return user;
  }

  private normalizePhone(phone: string): string {
    // Remove all non-digit characters
    let normalized = phone.replace(/\D/g, '');

    // Add country code if missing (assuming Uzbekistan +998)
    if (!normalized.startsWith('998')) {
      normalized = '998' + normalized;
    }

    return normalized;
  }
}
