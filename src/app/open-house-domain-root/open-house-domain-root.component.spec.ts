import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenHouseDomainRootComponent } from './open-house-domain-root.component';

describe('OpenHouseDomainRootComponent', () => {
  let component: OpenHouseDomainRootComponent;
  let fixture: ComponentFixture<OpenHouseDomainRootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenHouseDomainRootComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenHouseDomainRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
