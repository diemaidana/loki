import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserController } from './user-controller';

describe('UserController', () => {
  let component: UserController;
  let fixture: ComponentFixture<UserController>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserController]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
