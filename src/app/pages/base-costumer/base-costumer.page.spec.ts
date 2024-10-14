import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseCostumerPage } from './base-costumer.page';

describe('BaseCostumerPage', () => {
  let component: BaseCostumerPage;
  let fixture: ComponentFixture<BaseCostumerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BaseCostumerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
