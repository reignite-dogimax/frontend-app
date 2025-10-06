import { notificationFromDto, notificationToDto } from './notification.mapper';
import { NotificationDto } from '../http/notification.dto';

describe('notification.mapper', () => {
  it('should map from DTO to domain entity', () => {
    const dto: NotificationDto = {
      id: 1,
      usuarioId: 42,
      mensaje: 'Hola',
      tipo: 'Bienvenida',
      leido: false,
      createdAt: '2024-01-01T00:00:00Z'
    };

    const entity = notificationFromDto(dto);

    expect(entity).toEqual({
      id: 1,
      usuarioId: 42,
      mensaje: 'Hola',
      tipo: 'Bienvenida',
      leido: false,
      createdAt: '2024-01-01T00:00:00Z'
    });
  });

  it('should map from domain entity to DTO', () => {
    const entity = {
      id: 2,
      usuarioId: null,
      mensaje: 'Test',
      tipo: 'Promocion',
      leido: true,
      createdAt: null
    };

    const dto = notificationToDto(entity);

    expect(dto).toEqual({
      id: 2,
      usuarioId: null,
      mensaje: 'Test',
      tipo: 'Promocion',
      leido: true,
      createdAt: null
    });
  });
});

