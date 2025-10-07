import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Layout } from './layout.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationsStore } from '../../../../notifications/presentation/state/notifications.store';

class MockNotificationsStore {
  items = () => [] as any[];
  loading = () => false;
  error = () => null;
  unreadCount = () => 0;
  load = jasmine.createSpy('load');
  markAsRead = jasmine.createSpy('markAsRead');
  markAllAsRead = jasmine.createSpy('markAllAsRead');
  remove = jasmine.createSpy('remove');
}

describe('Layout', () => {
  let component: Layout;
  let fixture: ComponentFixture<Layout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Layout, RouterTestingModule, TranslateModule.forRoot(), NoopAnimationsModule],
      providers: [
        { provide: NotificationsStore, useClass: MockNotificationsStore }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Layout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
