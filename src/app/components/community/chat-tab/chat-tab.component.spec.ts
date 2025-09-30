import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ChatTabComponent } from './chat-tab.component';

describe('ChatTabComponent', () => {
  let component: ChatTabComponent;
  let fixture: ComponentFixture<ChatTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatTabComponent, FormsModule, IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with chat rooms', () => {
    expect(component.chatRooms).toBeDefined();
    expect(component.chatRooms.length).toBeGreaterThan(0);
  });

  it('should auto-select first chat room on init', () => {
    component.ngOnInit();
    expect(component.selectedRoom).toBeDefined();
    expect(component.selectedRoom?.id).toBe(component.chatRooms[0].id);
  });

  it('should select a chat room', () => {
    const room = component.chatRooms[1];
    component.selectRoom(room);
    expect(component.selectedRoom).toBe(room);
  });

  it('should load messages when selecting a room', (done) => {
    const room = component.chatRooms[0];
    component.selectRoom(room);

    setTimeout(() => {
      expect(component.messages.length).toBeGreaterThan(0);
      expect(component.isLoading).toBeFalse();
      done();
    }, 600);
  });

  it('should send a message', () => {
    component.selectedRoom = component.chatRooms[0];
    component.newMessage = 'Test message';
    const initialCount = component.messages.length;

    component.sendMessage();

    expect(component.messages.length).toBe(initialCount + 1);
    expect(component.newMessage).toBe('');
    expect(component.messages[component.messages.length - 1].message).toBe(
      'Test message'
    );
  });

  it('should not send empty message', () => {
    component.selectedRoom = component.chatRooms[0];
    component.newMessage = '   ';
    const initialCount = component.messages.length;

    component.sendMessage();

    expect(component.messages.length).toBe(initialCount);
    expect(component.newMessage).toBe('   ');
  });

  it('should format time correctly', () => {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    expect(component.formatTime(now)).toBe('now');
    expect(component.formatTime(oneMinuteAgo)).toBe('1m ago');
    expect(component.formatTime(oneHourAgo)).toBe('1h ago');
    expect(component.formatTime(oneDayAgo)).toBe('1d ago');
  });

  it('should handle enter key to send message', () => {
    component.selectedRoom = component.chatRooms[0];
    component.newMessage = 'Test message';
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    spyOn(event, 'preventDefault');
    spyOn(component, 'sendMessage');

    component.onEnter(event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.sendMessage).toHaveBeenCalled();
  });

  it('should not send message on shift+enter', () => {
    component.selectedRoom = component.chatRooms[0];
    component.newMessage = 'Test message';
    const event = new KeyboardEvent('keydown', {
      key: 'Enter',
      shiftKey: true,
    });
    spyOn(event, 'preventDefault');
    spyOn(component, 'sendMessage');

    component.onEnter(event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(component.sendMessage).not.toHaveBeenCalled();
  });
});
