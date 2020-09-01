import { Directive, Input, ViewContainerRef, TemplateRef, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[];
  isVisible = false;

  constructor(private viewContainerRef: ViewContainerRef, private templateRef: TemplateRef<any>, private authService: AuthService) { }

  // tslint:disable-next-line: max-line-length
  // * (with structural Directive) it ensures it converts the element that we are on, that we are applying this directive to, it changes it into <ng-template>

  // tslint:disable-next-line: typedef
  ngOnInit() {
    const userRoles = this.authService.decodedToken.role as Array<string>;

    // if the user is not a member of any roles at all, we dont want to display whatever we are using this appHasRole on
    if (!userRoles) {
      this.viewContainerRef.clear();
    }

    // if the user has the particular needed role, then render the elemet
    if (this.authService.roleMatch(this.appHasRole)) {

      if (!this.isVisible) {
        this.isVisible = true;
        // this.templateRef refers to the element that we are applying this structural directive to
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
      else {
        this.isVisible = false;
        this.viewContainerRef.clear();
      }
    }
  }

}
