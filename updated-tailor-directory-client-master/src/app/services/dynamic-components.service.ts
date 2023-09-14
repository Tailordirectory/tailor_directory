import {Component, ComponentFactoryResolver, Injectable, ViewContainerRef} from '@angular/core';

@Injectable()
export class DynamicComponentsService {

  viewContainerRef: ViewContainerRef;

  constructor(
    private factoryResolver: ComponentFactoryResolver) {
  }

  setRootViewContainerRef(viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
  }

  addDynamicComponent(dynamicComponent: any) {
    const factory = this.factoryResolver
      .resolveComponentFactory(dynamicComponent);
    const component = factory
      .create(this.viewContainerRef.parentInjector);
    this.viewContainerRef.insert(component.hostView);
  }

}
