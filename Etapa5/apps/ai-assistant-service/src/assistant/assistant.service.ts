import { Injectable } from '@nestjs/common';
import { AskAssistantDto } from './dto/ask-assistant.dto';

@Injectable()
export class AssistantService {
  ask(dto: AskAssistantDto) {
    return {
      query: dto.query,
      flow: [
        '1. Validar consulta del usuario',
        '2. Buscar candidatos en base vectorial',
        '3. Armar prompt con contexto recuperado',
        '4. Llamar al proveedor LLM con timeout',
        '5. Responder sin ejecutar reservas automaticamente',
      ],
      message:
        'Esqueleto RAG: este servicio orquesta busqueda vectorial y respuesta LLM.',
    };
  }
}

