import { Body, Controller, Get, Post } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { AskAssistantDto } from './dto/ask-assistant.dto';

@Controller()
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Get('health')
  health() {
    return { status: 'ok', service: 'ai-assistant-service' };
  }

  @Post('assistant/ask')
  ask(@Body() dto: AskAssistantDto) {
    return this.assistantService.ask(dto);
  }
}

