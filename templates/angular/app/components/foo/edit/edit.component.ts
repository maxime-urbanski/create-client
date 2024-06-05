import {Component, computed, OnInit, signal, WritableSignal} from '@angular/core';
import {DeleteComponent} from "../../common/delete/delete.component";
import {Router, RouterLink} from "@angular/router";
import {HeroService} from "../../../service/hero.service";
import {CommonModule, Location} from "@angular/common";
import {ApiShow} from "../../../interface/api";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    DeleteComponent,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit.component.html',
})
export class EditComponent implements OnInit {
  public isLoading: WritableSignal<boolean> = signal(false)
  public item: WritableSignal<ApiShow | null> = signal(null)

  constructor(
    private router: Router,
    private heroService: HeroService,
    private location: Location
  ) {
  }

  ngOnInit() {
    this.loadData()
  }

  loadData() {
    this.isLoading.set(true)
    const splitUrl = this.router.url.split('/edit')[0]
    this.heroService
      .getHero(splitUrl)
      .subscribe(item => {
        this.item.set(item)
        this.isLoading.set(false)
      })
  }
  getItemId(event: any) {
    this.item.update(update => {
      if (update) {
        return {
          ...update,
          name: event
        }
      } else {
        return update
      }
    })
  }

  onSubmit(event: any) {
    return this.heroService.putHero(
      this.item()?.["@id"],
      this.item()
    ).subscribe(() => {
      this.location.back()
    })
  }

  delete() {
    return this.heroService.delete(
      this.item()?.["@id"]
    ).subscribe(
      () => this.location.back()
    )
  }
}