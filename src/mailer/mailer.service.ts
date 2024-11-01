import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter;
  private verificationCodes: Map<string, string> = new Map(); // Храним коды для email

  constructor() {
    // Настройка Nodemailer для использования mail.ru
    this.transporter = nodemailer.createTransport({
      host: 'smtp.mail.ru',
      port: 587, // Используем порт для mail.ru
      secure: false, // Используем STARTTLS
      auth: {
        user: process.env.SMTP_USER, // Твой email на mail.ru
        pass: process.env.SMTP_PASSWORD, // Пароль или токен приложения
      },
    });
  }

  // Отправка кода подтверждения на email
  // async sendVerificationCode(email: string): Promise<void> {
  //   const verificationCode = Math.floor(1000 + Math.random() * 9000).toString(); // Генерация уникального кода
  //   this.verificationCodes.set(email, verificationCode); // Сохраняем код для email

  //   const mailOptions = {
  //     from: process.env.SMTP_USER, // Отправитель
  //     to: email, // Получатель
  //     subject: 'Подтверждение Email',
  //     html: `<p>Ваш код подтверждения: <b>${verificationCode}</b></p>`, // Тело письма
  //   };

  //   try {
  //     await this.transporter.sendMail(mailOptions);
  //   } catch (error) {
  //     throw new Error('Ошибка отправки письма');
  //   }
  // }

  // // Проверка кода подтверждения
  // validateCode(email: string, code: string): boolean {
  //   try {
  //     console.log('Проверка кода для:', email, 'Код:', code);
  //     const storedCode = this.verificationCodes.get(email.toLowerCase()); // Получаем сохраненный код

  //     if (!storedCode) {
  //       console.log('Код не найден для:', email);
  //       throw new BadRequestException(
  //         'Код верификации не найден для данного email'
  //       ); // Если код не найден
  //     }

  //     if (storedCode !== code) {
  //       console.log('Неверный код для:', email, 'Ожидалось:', storedCode);
  //       throw new BadRequestException('Неверный код верификации'); // Если код не совпадает
  //     }

  //     this.verificationCodes.delete(email.toLowerCase()); // Удаляем код после успешной проверки
  //     console.log('Код успешно проверен для:', email);
  //     return true;
  //   } catch (error) {
  //     console.error('Ошибка проверки кода:', error);
  //     throw error; // Выбрасываем исключение дальше
  //   }
  // }
}
